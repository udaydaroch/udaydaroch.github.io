import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * A guy on a road who runs to wherever your cursor is.
 * Four stations sit along the road. Park the cursor on one and he uses it:
 *   cricket  → picks up the bat and plays shots
 *   code     → picks up the laptop and starts typing
 *   pizza    → kneads and tosses pizza dough
 *   teach    → writes on the whiteboard
 */

type StationId = "cricket" | "code" | "pizza" | "teach";

const STATION_META: { id: StationId; icon: string; title: string; sub: string; short: string }[] = [
  { id: "cricket", icon: "🏏", title: "Cricket", sub: "Off the clock", short: "Cricket" },
  { id: "code", icon: "💻", title: "Software Engineer", sub: "Ubiik Mimomax · Fleetpin", short: "Code" },
  { id: "pizza", icon: "🍕", title: "Pizza Hut", sub: "Kitchen & delivery · 2023–24", short: "Pizza" },
  { id: "teach", icon: "📚", title: "Programming Tutor", sub: "UC · COSC121 & COSC131", short: "Teach" },
];

// ── Pose (joint angles in radians) ───────────────────────────────────────────
const POSE_KEYS = [
  "legLx", "legRx", "kneeL", "kneeR",
  "armLx", "armLz", "armRx", "armRz", "elbowL", "elbowR",
  "torsoX", "torsoY", "headX", "headY", "hipsY",
] as const;
type Pose = Record<(typeof POSE_KEYS)[number], number>;
const zeroPose = (): Pose => Object.fromEntries(POSE_KEYS.map(k => [k, 0])) as Pose;
const IDLE: Pose = { ...zeroPose(), armLz: 0.1, armRz: -0.1, elbowL: -0.15, elbowR: -0.15 };

const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const o = zeroPose();
  for (const k of POSE_KEYS) o[k] = a[k] + (b[k] - a[k]) * t;
  return o;
};
const ease = (x: number) => x * x * (3 - 2 * x);
function keyframes(frames: { t: number; p: Partial<Pose> }[], t: number, base: Pose): Pose {
  let i = 0;
  while (i < frames.length - 2 && t > frames[i + 1].t) i++;
  const a = frames[i], b = frames[i + 1];
  const k = ease(THREE.MathUtils.clamp((t - a.t) / (b.t - a.t), 0, 1));
  return lerpPose({ ...base, ...a.p }, { ...base, ...b.p }, k);
}
const lerpAngle = (a: number, b: number, t: number) => {
  const d = ((((b - a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
  return a + d * t;
};

// Batting: stance → backlift → whip through → follow-through
const BAT_STANCE: Partial<Pose> = { armRx: -0.35, armLx: -0.5, armLz: -0.5, armRz: 0.12, elbowR: -0.25, elbowL: -0.45, torsoY: 0.3, legLx: -0.2, legRx: 0.12, kneeL: 0.2, kneeR: 0.1 };
const BAT_FRAMES = [
  { t: 0, p: BAT_STANCE },
  { t: 0.38, p: BAT_STANCE },
  { t: 0.52, p: { ...BAT_STANCE, armRx: -2.7, armLx: -2.4, armLz: -0.3, elbowR: -0.3, elbowL: -0.5, torsoY: 0.85 } },
  { t: 0.62, p: { ...BAT_STANCE, armRx: -1.25, armLx: -1.15, armLz: -0.55, armRz: 0.2, elbowR: -0.1, elbowL: -0.2, torsoY: -0.75, legLx: -0.35 } },
  { t: 0.8, p: { ...BAT_STANCE, armRx: -2.5, armLx: -2.3, armLz: -0.2, armRz: 0.2, elbowR: -0.6, elbowL: -0.8, torsoY: -1.25, legLx: -0.35 } },
  { t: 1, p: BAT_STANCE },
];
const BAT_CYCLE = 2.1;
const BAT_CONTACT = 0.6;

const PIZZA_CYCLE = 3.4;
const TOSS_START = 2.3;

// ── Canvas texture helpers ───────────────────────────────────────────────────
function textSprite(text: string, color: string, size = 64) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 128;
  const g = c.getContext("2d")!;
  g.font = `bold ${size}px "DM Mono", ui-monospace, monospace`;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = color; g.shadowBlur = 18;
  g.fillStyle = color;
  g.fillText(text, 128, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  s.scale.set(0.9, 0.45, 1);
  return s;
}

const CODE_LINES = [
  ["#c792ea", "const "], ["#82aaff", "ship"], ["#ffffff", " = async () => {"],
  ["#89ddff", "  await "], ["#ffcb6b", "build"], ["#ffffff", "();"],
  ["#89ddff", "  await "], ["#ffcb6b", "test"], ["#ffffff", "();"],
  ["#89ddff", "  return "], ["#c3e88d", "'deployed ✓'"], ["#ffffff", ";"],
  ["#ffffff", "};"],
];
function drawCode(g: CanvasRenderingContext2D, offset: number) {
  g.fillStyle = "#0d1020"; g.fillRect(0, 0, 256, 160);
  g.font = "13px monospace";
  const rows: [string, string][][] = [];
  let row: [string, string][] = [];
  CODE_LINES.forEach(([c, t]) => { row.push([c, t]); if (t.endsWith(";") || t.endsWith("{") || t === "};") { rows.push(row); row = []; } });
  for (let i = 0; i < 9; i++) {
    const r = rows[(i + offset) % rows.length];
    let x = 12;
    g.fillStyle = "#3a4166"; g.fillText(String(((i + offset) % 99) + 1).padStart(2, " "), 2, 18 + i * 16);
    x = 26;
    for (const [c, t] of r) { g.fillStyle = c; g.fillText(t, x, 18 + i * 16); x += g.measureText(t).width; }
  }
  if (Math.floor(offset / 2) % 2 === 0) { g.fillStyle = "#7c8fff"; g.fillRect(26, 18 + 8 * 16 - 11, 7, 13); }
}

const BOARD_TEXT = ["def mean(xs):", "    return sum(xs) / len(xs)", "", "mean([2, 4, 6])  →  4", "Any questions? :)"];
const BOARD_TOTAL = BOARD_TEXT.join("").length;
function drawBoard(g: CanvasRenderingContext2D, chars: number) {
  g.fillStyle = "#f4f5f8"; g.fillRect(0, 0, 512, 300);
  g.strokeStyle = "rgba(0,0,0,0.05)";
  for (let y = 40; y < 300; y += 44) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  g.font = "bold 30px 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive";
  let left = chars;
  BOARD_TEXT.forEach((line, i) => {
    const n = Math.max(0, Math.min(line.length, left));
    left -= line.length;
    g.fillStyle = i === 3 ? "#d23a33" : i === 4 ? "#2f8f5b" : "#2a3a8f";
    g.fillText(line.slice(0, n), 22, 48 + i * 52);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
export default function RoadScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const goToRef = useRef<(i: number) => void>(() => {});
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xc4ccff, 0x151822, 1.1));
    const sun = new THREE.DirectionalLight(0xfff0dc, 2.2);
    sun.position.set(-4, 9, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 1024);
    Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 5, bottom: -5, near: 1, far: 30 });
    sun.shadow.bias = -0.0004;
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x8e9cff, 1.2);
    rim.position.set(3, 4, -6);
    scene.add(rim);

    // ── World: ground, road, footpath ────────────────────────────────────────
    const mat = (color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...extra });
    const box = (w: number, h: number, d: number, m: THREE.Material) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
      b.castShadow = true; b.receiveShadow = true; return b;
    };
    const cyl = (rt: number, rb: number, h: number, m: THREE.Material, seg = 16) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
      c.castShadow = true; return c;
    };
    const flat = (w: number, d: number, m: THREE.Material, x: number, y: number, z: number) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
      p.rotation.x = -Math.PI / 2; p.position.set(x, y, z); p.receiveShadow = true; scene.add(p); return p;
    };

    flat(80, 30, mat(0x0e1119, { roughness: 1 }), 0, 0, -8);
    flat(80, 2.4, mat(0x1c2030, { roughness: 0.95 }), 0, 0.002, 0.6);                 // road
    flat(80, 1.9, mat(0x2a2f44, { roughness: 0.9 }), 0, 0.004, -1.55);                // footpath
    flat(80, 0.06, new THREE.MeshBasicMaterial({ color: 0x7c8fff }), 0, 0.006, -0.6); // glowing kerb
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xd8dcf0 });
    for (let x = -30; x < 30; x += 1.6) flat(0.8, 0.07, dashMat, x, 0.005, 0.6);

    // ── Stations ─────────────────────────────────────────────────────────────
    const SX = [-6, -2, 2, 6];
    type Station = {
      x: number; stand: THREE.Vector2; faceUse: number; facePick?: number;
      item?: THREE.Object3D; restPos?: THREE.Vector3; restRot?: THREE.Euler;
      holder?: "handR" | "chest"; holdPos?: THREE.Vector3; holdRot?: THREE.Euler;
    };

    // 1. Cricket: stumps + bat leaning on them
    const bx = SX[0];
    const wood = mat(0xe3cc9a, { roughness: 0.55 });
    for (const dx of [-0.1, 0, 0.1]) {
      const s = cyl(0.02, 0.02, 0.72, wood, 10); s.position.set(bx + 0.62 + dx, 0.36, -1.45); scene.add(s);
    }
    const bails = box(0.24, 0.025, 0.03, wood); bails.position.set(bx + 0.62, 0.735, -1.45); scene.add(bails);
    const bat = new THREE.Group();
    const grip = cyl(0.02, 0.018, 0.3, mat(0x2a2f5a), 10); grip.position.y = -0.15; bat.add(grip);
    const blade = box(0.1, 0.55, 0.035, mat(0xe8cd96, { roughness: 0.5 })); blade.position.y = -0.56; bat.add(blade);
    const sticker = box(0.06, 0.22, 0.037, mat(0x7c8fff, { emissive: 0x7c8fff, emissiveIntensity: 0.4 })); sticker.position.y = -0.5; bat.add(sticker);
    scene.add(bat);

    // 2. Code: little desk with a laptop
    const lx = SX[1];
    const deskTop = box(0.9, 0.05, 0.55, mat(0x3a3f5c)); deskTop.position.set(lx, 0.74, -1.4); scene.add(deskTop);
    for (const [dx, dz] of [[-0.4, -0.22], [0.4, -0.22], [-0.4, 0.22], [0.4, 0.22]]) {
      const leg = cyl(0.02, 0.02, 0.72, mat(0x1b1e2c), 8); leg.position.set(lx + dx, 0.36, -1.4 + dz); scene.add(leg);
    }
    const mug = cyl(0.045, 0.04, 0.1, mat(0xe0443e)); mug.position.set(lx + 0.3, 0.815, -1.5); scene.add(mug);
    const laptop = new THREE.Group();
    const lapBase = box(0.4, 0.022, 0.28, mat(0xb9bfd3, { metalness: 0.6, roughness: 0.35 })); laptop.add(lapBase);
    const keys = box(0.34, 0.004, 0.14, mat(0x1d2030)); keys.position.set(0, 0.012, -0.03); laptop.add(keys);
    const lidHinge = new THREE.Group(); lidHinge.position.set(0, 0.011, 0.14); lidHinge.rotation.x = 0.28; laptop.add(lidHinge);
    const lid = box(0.4, 0.27, 0.016, mat(0xb9bfd3, { metalness: 0.6, roughness: 0.35 })); lid.position.y = 0.135; lidHinge.add(lid);
    const screenCanvas = document.createElement("canvas"); screenCanvas.width = 256; screenCanvas.height = 160;
    const screenCtx = screenCanvas.getContext("2d")!; drawCode(screenCtx, 0);
    const screenTex = new THREE.CanvasTexture(screenCanvas); screenTex.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.37, 0.24), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
    screen.position.set(0, 0.135, -0.009); screen.rotation.y = Math.PI; lidHinge.add(screen);
    const logo = new THREE.Mesh(new THREE.CircleGeometry(0.025, 20), new THREE.MeshBasicMaterial({ color: 0x9aa8ff }));
    logo.position.set(0, 0.135, 0.009); lidHinge.add(logo);
    laptop.traverse(o => { o.castShadow = true; });
    scene.add(laptop);

    // 3. Pizza: long counter, dough, and a wood-fired oven
    const px = SX[2];
    const counter = box(0.62, 0.9, 1.3, mat(0x6b4a33, { roughness: 0.7 })); counter.position.set(px + 0.55, 0.45, -1.4); scene.add(counter);
    const counterTop = box(0.68, 0.04, 1.36, mat(0xdad6cf, { roughness: 0.4 })); counterTop.position.set(px + 0.55, 0.92, -1.4); scene.add(counterTop);
    const dough = new THREE.Group();
    const doughDisc = cyl(0.17, 0.17, 0.03, mat(0xf2d9a6, { roughness: 0.9 }), 28); dough.add(doughDisc);
    const sauce = cyl(0.145, 0.145, 0.032, mat(0xc9362b, { roughness: 0.6 }), 28); sauce.visible = false; dough.add(sauce);
    for (let i = 0; i < 5; i++) {
      const pep = cyl(0.03, 0.03, 0.036, mat(0x8e1f18), 12);
      const a = (i / 5) * Math.PI * 2; pep.position.set(Math.cos(a) * 0.08, 0.002, Math.sin(a) * 0.08); pep.visible = false; pep.name = "pep"; dough.add(pep);
    }
    const doughRest = new THREE.Vector3(px + 0.45, 0.955, -1.3);
    dough.position.copy(doughRest); scene.add(dough);
    const oven = new THREE.Group();
    const ovenBase = box(1.0, 0.7, 0.9, mat(0x39302c)); ovenBase.position.y = 0.35; oven.add(ovenBase);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xa0553a, { roughness: 0.95 }));
    dome.position.y = 0.7; dome.castShadow = true; oven.add(dome);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xff7a2e, toneMapped: false });
    const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24, 0, Math.PI), mouthMat);
    mouth.position.set(0, 0.71, 0.475); oven.add(mouth);
    const chimney = cyl(0.07, 0.07, 0.35, mat(0x2a2522)); chimney.position.set(0.12, 1.25, -0.05); oven.add(chimney);
    oven.position.set(px + 1.6, 0, -2.0); scene.add(oven);
    const fire = new THREE.PointLight(0xff8a3d, 0, 3, 2); fire.position.set(px + 1.6, 0.75, -1.4); scene.add(fire);

    // 4. Teach: whiteboard on legs
    const tx = SX[3];
    const board = new THREE.Group();
    const frame = box(1.8, 1.1, 0.05, mat(0xaab0c0, { metalness: 0.5, roughness: 0.4 })); board.add(frame);
    const boardCanvas = document.createElement("canvas"); boardCanvas.width = 512; boardCanvas.height = 300;
    const boardCtx = boardCanvas.getContext("2d")!; drawBoard(boardCtx, 0);
    const boardTex = new THREE.CanvasTexture(boardCanvas); boardTex.colorSpace = THREE.SRGBColorSpace;
    const surface = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.0), new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.35 }));
    surface.position.z = 0.027; board.add(surface);
    for (const dx of [-0.75, 0.75]) { const l = cyl(0.025, 0.025, 1.0, mat(0x6e7486), 8); l.position.set(dx, -1.0, 0); board.add(l); }
    const tray = box(1.2, 0.03, 0.08, mat(0x6e7486)); tray.position.set(0, -0.56, 0.05); board.add(tray);
    board.position.set(tx + 0.45, 1.5, -2.05); scene.add(board);
    const marker = cyl(0.014, 0.014, 0.13, mat(0x2a3a8f), 8); scene.add(marker);
    const markerRest = new THREE.Vector3(tx + 0.1, 0.955, -1.99);

    const stations: Station[] = [
      { x: bx, stand: new THREE.Vector2(bx + 0.3, -0.75), facePick: 2.6, faceUse: -0.5, item: bat,
        restPos: new THREE.Vector3(bx + 0.5, 0.8, -1.32), restRot: new THREE.Euler(0.25, 0, -0.18),
        holder: "handR", holdPos: new THREE.Vector3(0, 0.12, 0.02), holdRot: new THREE.Euler(0.4, 0, 0) },
      { x: lx, stand: new THREE.Vector2(lx, -0.72), facePick: Math.PI, faceUse: 0.55, item: laptop,
        restPos: new THREE.Vector3(lx - 0.05, 0.777, -1.38), restRot: new THREE.Euler(0, Math.PI, 0),
        holder: "chest", holdPos: new THREE.Vector3(0, -0.02, 0.1), holdRot: new THREE.Euler(0.2, 0, 0) },
      { x: px, stand: new THREE.Vector2(px - 0.15, -1.3), faceUse: Math.PI / 2 },
      { x: tx, stand: new THREE.Vector2(tx - 0.72, -1.62), faceUse: 1.8, item: marker,
        restPos: markerRest, restRot: new THREE.Euler(0, 0, Math.PI / 2),
        holder: "handR", holdPos: new THREE.Vector3(0, -0.02, 0.03), holdRot: new THREE.Euler(1.2, 0, 0) },
    ];
    const placeAtRest = (s: Station) => {
      if (!s.item || !s.restPos || !s.restRot) return;
      scene.add(s.item); s.item.position.copy(s.restPos); s.item.rotation.copy(s.restRot);
    };
    stations.forEach(placeAtRest);

    // ── The guy ──────────────────────────────────────────────────────────────
    const skin = mat(0xc68a5e, { roughness: 0.6 });
    const hairM = mat(0x17110d, { roughness: 0.7 });
    const shirt = mat(0x6c7cff, { roughness: 0.65 });
    const jeans = mat(0x2d3d66, { roughness: 0.8 });
    const shoe = mat(0xf1f1f1, { roughness: 0.6 });
    const sole = mat(0x1a1a1a);

    const root = new THREE.Group(); scene.add(root);
    const hips = new THREE.Group(); hips.position.y = 0.95; root.add(hips);
    const pelvis = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.1, 6, 12), jeans);
    pelvis.rotation.z = Math.PI / 2; pelvis.scale.set(1, 1, 0.8); pelvis.castShadow = true; hips.add(pelvis);

    const makeLeg = (side: number) => {
      const leg = new THREE.Group(); leg.position.set(0.1 * side, -0.03, 0); hips.add(leg);
      const thigh = cyl(0.075, 0.064, 0.44, jeans, 12); thigh.position.y = -0.22; leg.add(thigh);
      const knee = new THREE.Group(); knee.position.y = -0.44; leg.add(knee);
      const shin = cyl(0.062, 0.054, 0.42, jeans, 12); shin.position.y = -0.21; knee.add(shin);
      const foot = box(0.12, 0.08, 0.25, shoe); foot.position.set(0, -0.44, 0.05); knee.add(foot);
      const s = box(0.125, 0.02, 0.255, sole); s.position.set(0, -0.485, 0.05); knee.add(s);
      return { leg, knee };
    };
    const L = makeLeg(1), R = makeLeg(-1);

    const torso = new THREE.Group(); torso.position.y = 0.02; hips.add(torso);
    const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.28, 8, 16), shirt);
    chest.position.y = 0.32; chest.scale.set(1.05, 1, 0.72); chest.castShadow = true; torso.add(chest);
    const neck = cyl(0.055, 0.06, 0.1, skin, 10); neck.position.y = 0.62; torso.add(neck);
    const chestHolder = new THREE.Object3D(); chestHolder.position.set(0, 0.3, 0.3); torso.add(chestHolder);

    const head = new THREE.Group(); head.position.y = 0.66; torso.add(head);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.17, 28, 20), skin); skull.position.y = 0.15; skull.castShadow = true; head.add(skull);
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.178, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.45), hairM);
    hair.position.set(0, 0.16, -0.012); hair.rotation.x = -0.35; head.add(hair);
    const quiff = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 10), hairM); quiff.position.set(0.02, 0.31, 0.07); quiff.scale.set(1.6, 0.6, 1); head.add(quiff);
    const eyeM = mat(0x101010, { roughness: 0.2 });
    const eyes = [-0.06, 0.06].map(x => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), eyeM); e.position.set(x, 0.17, 0.155); head.add(e); return e; });
    const brows = [-0.06, 0.06].map(x => { const b = box(0.06, 0.012, 0.02, hairM); b.position.set(x, 0.215, 0.155); head.add(b); return b; });
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 6, 16, Math.PI), mat(0x5a2a1a));
    smile.position.set(0, 0.1, 0.158); smile.rotation.z = Math.PI; head.add(smile);
    for (const x of [-0.17, 0.17]) { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), skin); ear.position.set(x, 0.15, 0); head.add(ear); }

    const makeArm = (side: number) => {
      const arm = new THREE.Group(); arm.position.set(0.25 * side, 0.5, 0); torso.add(arm);
      const sleeve = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), shirt); sleeve.castShadow = true; arm.add(sleeve);
      const upper = cyl(0.058, 0.05, 0.3, shirt, 10); upper.position.y = -0.15; arm.add(upper);
      const elbow = new THREE.Group(); elbow.position.y = -0.3; arm.add(elbow);
      const fore = cyl(0.045, 0.04, 0.26, skin, 10); fore.position.y = -0.13; elbow.add(fore);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), skin); hand.position.y = -0.28; hand.castShadow = true; elbow.add(hand);
      const holder = new THREE.Object3D(); holder.position.y = -0.3; elbow.add(holder);
      return { arm, elbow, holder };
    };
    const AL = makeArm(1), AR = makeArm(-1);

    const applyPose = (p: Pose) => {
      L.leg.rotation.x = p.legLx; R.leg.rotation.x = p.legRx;
      L.knee.rotation.x = p.kneeL; R.knee.rotation.x = p.kneeR;
      AL.arm.rotation.set(p.armLx, 0, p.armLz); AR.arm.rotation.set(p.armRx, 0, p.armRz);
      AL.elbow.rotation.x = p.elbowL; AR.elbow.rotation.x = p.elbowR;
      torso.rotation.set(p.torsoX, p.torsoY, 0);
      head.rotation.set(p.headX, p.headY, 0);
      hips.position.y = 0.95 + p.hipsY;
    };
    const pose = { ...IDLE };

    // ── Floating sprites (code glyphs, "+1 🍕", "FOUR!") ─────────────────────
    const floaters: { s: THREE.Sprite; v: THREE.Vector3; life: number }[] = [];
    const float = (text: string, color: string, at: THREE.Vector3, size = 64) => {
      const s = textSprite(text, color, size);
      s.position.copy(at);
      scene.add(s);
      floaters.push({ s, v: new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.7, 0), life: 1.6 });
    };
    const GLYPHS = ["</>", "{ }", "=>", "git push", "✓ tests", "npm run", "async", "[ ]"];

    const balls: { m: THREE.Mesh; v: THREE.Vector3; life: number }[] = [];
    const ballMat = mat(0xd8302a, { roughness: 0.35 });
    const ballGeo = new THREE.SphereGeometry(0.045, 14, 10);

    // ── Camera / sizing (camera pans to follow him on narrow screens) ────────
    let halfW = 8, camX = 0, dist = 12;
    const lookY = 1.3;
    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      dist = THREE.MathUtils.clamp(8.2 / (tanH * camera.aspect), 8.5, 12.5);
      halfW = tanH * dist * camera.aspect;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(mount); resize();

    // ── Input: cursor anywhere on the page steers him ────────────────────────
    const ndc = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const roadPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.6);
    const hit = new THREE.Vector3();
    let targetX = 0;
    let forced: number | null = null;   // set by the station buttons / taps
    let hasPointer = false;
    const lastClient = { x: 0, y: 0 };
    const updateTargetFromClient = () => {
      const r = mount.getBoundingClientRect();
      ndc.set(((lastClient.x - r.left) / r.width) * 2 - 1, -(((lastClient.y - r.top) / r.height) * 2 - 1));
      ndc.y = THREE.MathUtils.clamp(ndc.y, -1, 1);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(roadPlane, hit)) targetX = THREE.MathUtils.clamp(hit.x, -9, 9);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // on phones use taps / buttons
      hasPointer = true; forced = null;
      lastClient.x = e.clientX; lastClient.y = e.clientY;
      updateTargetFromClient();
    };
    const onTap = (e: PointerEvent) => {
      hasPointer = true; forced = null;
      lastClient.x = e.clientX; lastClient.y = e.clientY;
      updateTargetFromClient();
      const near = stations.findIndex(s => Math.abs(s.x - targetX) < 1.3);
      if (near >= 0) forced = near;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    renderer.domElement.addEventListener("pointerdown", onTap);
    goToRef.current = (i: number) => { forced = i; hasPointer = true; };
    // Before anyone moves the mouse, he wanders over to the laptop and gets to work
    let introTimer = window.setTimeout(() => { if (!hasPointer) forced = 1; }, 900);

    // ── State machine ────────────────────────────────────────────────────────
    const pos = new THREE.Vector2(-0.5, 0.6);
    let rotY = 0;
    type Phase = "free" | "pickup" | "active" | "putdown";
    let phase: Phase = "free";
    let engaged: number | null = null;
    let phaseT = 0, activeT = 0, runPhase = 0;
    let lastActive: number | null = null;
    let lastScreen = -1, boardChars = 0, lastBoardChars = -1, glyphT = 0;
    let tossCount = 0, lastCycle = -1, ballSpawnedCycle = -1;

    const holders = { handR: AR.holder, chest: chestHolder };
    const attach = (s: Station) => {
      if (!s.item || !s.holder) return;
      holders[s.holder].add(s.item);
      s.item.position.copy(s.holdPos!); s.item.rotation.copy(s.holdRot!);
    };

    const desiredStation = (): number | null => {
      if (forced !== null) return forced;
      if (!hasPointer) return null;
      const i = stations.findIndex(s => Math.abs(s.x - targetX) < 1.1);
      return i >= 0 ? i : null;
    };

    const tmpV = new THREE.Vector3();
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(mount);

    const timer = new THREE.Timer();
    let raf = 0, elapsed = 0;
    const tick = (time?: number) => {
      raf = requestAnimationFrame(tick);
      timer.update(time);
      const dt = Math.min(timer.getDelta(), 0.05);
      if (!visible) return;
      elapsed += dt;
      if (hasPointer && forced === null) updateTargetFromClient(); // keeps working while the page scrolls

      const want = desiredStation();

      // leaving a station
      if ((phase === "active" || phase === "pickup") && want !== engaged) {
        const s = stations[engaged!];
        if (s.item && phase === "active") { phase = "putdown"; phaseT = 0; }
        else { if (s.item) placeAtRest(s); phase = "free"; engaged = null; }
      }

      let target: Pose = { ...IDLE };
      let moving = false;

      if (phase === "putdown") {
        phaseT += dt;
        const s = stations[engaged!];
        rotY = lerpAngle(rotY, s.facePick ?? s.faceUse, 1 - Math.exp(-dt * 10));
        const k = Math.sin(Math.min(1, phaseT / 0.45) * Math.PI);
        target = { ...IDLE, hipsY: -0.28 * k, legLx: -0.8 * k, legRx: -0.4 * k, kneeL: 1.3 * k, kneeR: 0.9 * k, torsoX: 0.45 * k, armRx: -0.9 * k, armLx: -0.4 * k };
        if (phaseT > 0.22 && s.item && s.item.parent !== scene) placeAtRest(s);
        if (phaseT > 0.45) { phase = "free"; engaged = null; }
      }

      if (phase === "free") {
        const s = want !== null ? stations[want] : null;
        const goal = s ? s.stand.clone() : new THREE.Vector2(targetX, 0.6);
        if (!hasPointer && !s) goal.set(pos.x, 0.6);
        // route: back to the road, along it, then in to the station
        let wp = goal;
        if (Math.abs(goal.x - pos.x) > 0.15) wp = pos.y < 0.5 ? new THREE.Vector2(pos.x, 0.6) : new THREE.Vector2(goal.x, 0.6);
        const d = wp.clone().sub(pos);
        const len = d.length();
        if (len > 0.02) {
          const speed = len > 0.6 ? 4.2 : 2.2;
          const step = Math.min(len, speed * dt);
          pos.addScaledVector(d.normalize(), step);
          runPhase += step * 4.2;
          rotY = lerpAngle(rotY, Math.atan2(d.x, d.y), 1 - Math.exp(-dt * 12));
          moving = true;
        } else if (s && wp === goal) {
          engaged = want; phaseT = 0; activeT = 0;
          phase = s.item ? "pickup" : "active";
        } else {
          rotY = lerpAngle(rotY, 0, 1 - Math.exp(-dt * 4));
        }
        if (moving) {
          const sp = Math.sin(runPhase), amp = len > 0.6 ? 1 : 0.55;
          target = {
            ...zeroPose(),
            legLx: -sp * 0.85 * amp, legRx: sp * 0.85 * amp,
            kneeL: Math.max(0, sp) * 1.3 * amp + 0.15, kneeR: Math.max(0, -sp) * 1.3 * amp + 0.15,
            armLx: sp * 0.8 * amp, armRx: -sp * 0.8 * amp, armLz: 0.08, armRz: -0.08,
            elbowL: -1.3, elbowR: -1.3, torsoX: 0.18 * amp, torsoY: sp * 0.12,
            hipsY: Math.abs(Math.cos(runPhase)) * 0.07 - 0.03,
          };
        } else {
          // idle: breathe and watch the cursor
          const look = THREE.MathUtils.clamp(Math.atan2(targetX - pos.x, 4) - rotY, -0.9, 0.9);
          target = { ...IDLE, headY: hasPointer ? look : Math.sin(elapsed * 0.7) * 0.4, torsoX: Math.sin(elapsed * 2) * 0.015 };
        }
      }

      if (phase === "pickup") {
        phaseT += dt;
        const s = stations[engaged!];
        rotY = lerpAngle(rotY, s.facePick ?? s.faceUse, 1 - Math.exp(-dt * 12));
        const k = Math.sin(Math.min(1, phaseT / 0.55) * Math.PI);
        target = { ...IDLE, hipsY: -0.3 * k, legLx: -0.85 * k, legRx: -0.45 * k, kneeL: 1.35 * k, kneeR: 0.95 * k, torsoX: 0.5 * k, armRx: -1.0 * k, armLx: -0.7 * k, headX: 0.3 * k };
        if (phaseT > 0.3 && s.item && s.item.parent === scene) attach(s);
        if (phaseT > 0.55) { phase = "active"; activeT = 0; }
      }

      if (phase === "active" && engaged !== null) {
        activeT += dt;
        const s = stations[engaged];
        rotY = lerpAngle(rotY, s.faceUse, 1 - Math.exp(-dt * 8));
        const id = STATION_META[engaged].id;

        if (id === "cricket") {
          const cyc = activeT / BAT_CYCLE, u = cyc % 1, n = Math.floor(cyc);
          target = keyframes(BAT_FRAMES, u, { ...IDLE });
          if (u > BAT_CONTACT && ballSpawnedCycle !== n) {
            ballSpawnedCycle = n;
            bat.localToWorld(tmpV.set(0, -0.55, 0));
            const m = new THREE.Mesh(ballGeo, ballMat); m.castShadow = true; m.position.copy(tmpV); scene.add(m);
            balls.push({ m, v: new THREE.Vector3(-2.5 - Math.random() * 2, 4.5 + Math.random() * 2, 2 + Math.random()), life: 2.2 });
            float(Math.random() > 0.5 ? "SIX!" : "FOUR!", "#f3c969", tmpV.clone().add(new THREE.Vector3(0, 0.6, 0)), 70);
          }
        } else if (id === "code") {
          const j = reduceMotion ? 0 : 1;
          target = { ...IDLE, armLx: -0.5, armRx: -0.5, armLz: -0.25, armRz: 0.25,
            elbowL: -1.35 + Math.sin(elapsed * 24) * 0.07 * j, elbowR: -1.35 + Math.sin(elapsed * 24 + 1.7) * 0.07 * j,
            headX: 0.35, torsoX: 0.06 };
          const line = Math.floor(activeT * 3);
          if (line !== lastScreen) { lastScreen = line; drawCode(screenCtx, line); screenTex.needsUpdate = true; }
          glyphT -= dt;
          if (glyphT <= 0) { glyphT = 0.7; laptop.localToWorld(tmpV.set(0, 0.35, 0.1)); float(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], "#9aa8ff", tmpV.clone(), 44); }
        } else if (id === "pizza") {
          const cyc = activeT / PIZZA_CYCLE, n = Math.floor(cyc), tt = (cyc % 1) * PIZZA_CYCLE;
          if (n !== lastCycle) {
            lastCycle = n; tossCount++;
            const done = tossCount % 3 === 0;
            sauce.visible = done; dough.children.forEach(c => { if (c.name === "pep") c.visible = done; });
            if (done) { dough.localToWorld(tmpV.set(0, 0.3, 0)); float("+1 🍕", "#ffb870", tmpV.clone(), 56); }
          }
          if (tt < TOSS_START) {
            const kn = Math.sin(elapsed * 7) * 0.2;
            target = { ...IDLE, armLx: -1.0 + kn, armRx: -1.0 - kn, armLz: -0.15, armRz: 0.15, elbowL: -0.5, elbowR: -0.5, torsoX: 0.25, headX: 0.35 };
            dough.position.copy(doughRest); dough.rotation.y += dt * 0.5; dough.scale.set(1, 1, 1);
          } else {
            const u = (tt - TOSS_START) / (PIZZA_CYCLE - TOSS_START);
            const up = Math.sin(Math.min(1, u * 1.4) * Math.PI);
            target = { ...IDLE, armLx: -1.0 - up * 1.6, armRx: -1.0 - up * 1.6, armLz: -0.12, armRz: 0.12, elbowL: -0.3, elbowR: -0.3, headX: -0.4 * up };
            dough.position.set(doughRest.x, doughRest.y + 4 * 0.75 * u * (1 - u), doughRest.z);
            dough.rotation.y += dt * 14;
            const sc = 1 + 0.35 * Math.sin(u * Math.PI); dough.scale.set(sc, 1, sc);
          }
        } else if (id === "teach") {
          const w = reduceMotion ? 0 : 1;
          target = { ...IDLE, armRx: -1.95 + Math.cos(elapsed * 9) * 0.07 * w, armRz: 0.12 + Math.sin(elapsed * 9) * 0.06 * w, elbowR: -0.35, headY: 0.1, headX: -0.1, torsoY: 0.1 };
          boardChars = Math.min(BOARD_TOTAL + 25, boardChars + dt * 14);
          if (boardChars >= BOARD_TOTAL + 25) boardChars = 0;
          const c = Math.floor(boardChars);
          if (c !== lastBoardChars) { lastBoardChars = c; drawBoard(boardCtx, c); boardTex.needsUpdate = true; }
        }
      }

      // fire glows while he's at the pizza station
      const pizzaOn = engaged === 2 && phase === "active";
      fire.intensity = THREE.MathUtils.lerp(fire.intensity, pizzaOn ? 5 + Math.sin(elapsed * 17) * 1.2 + Math.sin(elapsed * 7) : 0.6, 1 - Math.exp(-dt * 5));
      mouthMat.color.setHSL(0.06, 1, 0.45 + (pizzaOn ? 0.1 + Math.sin(elapsed * 13) * 0.05 : 0));

      // blend pose + apply
      const k = 1 - Math.exp(-dt * (moving ? 18 : 12));
      for (const key of POSE_KEYS) pose[key] += (target[key] - pose[key]) * k;
      applyPose(pose);
      root.position.set(pos.x, 0, pos.y);
      root.rotation.y = rotY;
      // blink
      const blink = (elapsed % 3.7) < 0.12 ? 0.15 : 1;
      eyes.forEach(e => (e.scale.y = blink));
      brows.forEach(b => (b.position.y = 0.215 + (phase === "active" ? 0.01 : 0)));

      // report station changes to the labels
      const nowActive = phase === "active" || phase === "pickup" ? engaged : null;
      if (nowActive !== lastActive) { lastActive = nowActive; setActive(nowActive); }

      // balls + floaters
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i]; b.v.y -= 9.8 * dt; b.m.position.addScaledVector(b.v, dt);
        if (b.m.position.y < 0.045) { b.m.position.y = 0.045; b.v.y *= -0.45; b.v.x *= 0.8; b.v.z *= 0.8; }
        b.life -= dt; if (b.life <= 0) { scene.remove(b.m); balls.splice(i, 1); }
      }
      for (let i = floaters.length - 1; i >= 0; i--) {
        const f = floaters[i]; f.life -= dt; f.s.position.addScaledVector(f.v, dt);
        (f.s.material as THREE.SpriteMaterial).opacity = Math.min(1, f.life * 1.5);
        if (f.life <= 0) { scene.remove(f.s); f.s.material.map?.dispose(); f.s.material.dispose(); floaters.splice(i, 1); }
      }

      // camera: static when the whole road fits, otherwise follow him
      const maxCam = Math.max(0, 7.4 - halfW);
      camX = THREE.MathUtils.lerp(camX, THREE.MathUtils.clamp(pos.x, -maxCam, maxCam), 1 - Math.exp(-dt * 3));
      camera.position.set(camX, 3.1, dist);
      camera.lookAt(camX, lookY, -0.6);

      // labels follow their stations on screen
      const w = mount.clientWidth, h = mount.clientHeight;
      stations.forEach((s, i) => {
        const el = labelRefs.current[i]; if (!el) return;
        tmpV.set(s.x + (i === 3 ? 0.45 : i === 2 ? 0.8 : 0.2), 2.45 + (i === 3 ? 0.35 : 0), -1.5).project(camera);
        el.style.transform = `translate(-50%, -100%) translate(${(tmpV.x * 0.5 + 0.5) * w}px, ${(-tmpV.y * 0.5 + 0.5) * h}px)`;
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(introTimer);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onTap);
      scene.traverse(o => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mm)) mm.forEach(x => x.dispose()); else mm?.dispose();
      });
      screenTex.dispose(); boardTex.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      introTimer = 0;
    };
  }, []);

  return (
    <div className="road-scene">
      <div ref={mountRef} className="road-canvas" role="img"
        aria-label="A little 3D version of Uday runs to your cursor. Stop on a station and he plays cricket, codes on a laptop, makes pizza or teaches at a whiteboard." />
      {STATION_META.map((m, i) => (
        <button
          key={m.id}
          ref={el => { labelRefs.current[i] = el; }}
          className={`road-label ${active === i ? "is-active" : ""}`}
          onClick={() => goToRef.current(i)}
        >
          <span className="road-label-icon">{m.icon}</span>
          <span className="road-label-text">
            <b>{m.title}</b>
            <small>{m.sub}</small>
          </span>
        </button>
      ))}
      <div className="road-chips" aria-label="Send him to a station">
        {STATION_META.map((m, i) => (
          <button key={m.id} className={active === i ? "is-active" : ""} onClick={() => goToRef.current(i)}>
            <span>{m.icon}</span>{m.short}
          </button>
        ))}
      </div>
    </div>
  );
}
