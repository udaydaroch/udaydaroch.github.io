import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/**
 * A stylised, procedurally-built 3D batter.
 *  - Head, eyes and torso track the cursor anywhere on the page.
 *  - Click (or call the imperative trigger) to play a shot: backlift,
 *    downswing with a glowing bat trail, and a ball launched off the bat.
 */

export interface CricketerHandle {
  playShot: () => void;
}

interface Props {
  onShot?: (runs: number) => void;
  /** receives an imperative handle so buttons outside the canvas can trigger shots */
  handleRef?: React.MutableRefObject<CricketerHandle | null>;
  autoPlayFirst?: boolean;
}

const BG = new THREE.Color("#0a0c12");
const ACCENT = new THREE.Color("#7c8fff");
const PURPLE = new THREE.Color("#a78bfa");
const BALL_RED = new THREE.Color("#d8302a");

// ── Swing keyframes (root-local space, batter faces +Z, his right hand is -X) ──
type Key = { t: number; hands: THREE.Vector3; rot: THREE.Vector3; torso: number; lean: number };
const KEYS: Key[] = [
  { t: 0.0,  hands: new THREE.Vector3(0.02, 0.84, 0.30),  rot: new THREE.Vector3(-0.22, 0, 0.05), torso: 0,     lean: 0 },
  { t: 0.34, hands: new THREE.Vector3(-0.30, 1.50, -0.06), rot: new THREE.Vector3(2.35, 0.2, 0.55), torso: -0.45, lean: -0.05 },
  { t: 0.47, hands: new THREE.Vector3(0.02, 0.98, 0.46),  rot: new THREE.Vector3(-1.15, 0.35, 0.0), torso: 0.15,  lean: 0.12 },
  { t: 0.70, hands: new THREE.Vector3(0.32, 1.52, 0.16),  rot: new THREE.Vector3(-2.85, 0, -0.7),  torso: 0.7,   lean: 0.04 },
  { t: 1.0,  hands: new THREE.Vector3(0.02, 0.84, 0.30),  rot: new THREE.Vector3(-0.22, 0, 0.05), torso: 0,     lean: 0 },
];
const CONTACT_T = 0.47;
const SWING_DURATION = 1.15;

const ease = (x: number) => x * x * (3 - 2 * x);

function sampleSwing(t: number) {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const k = ease(THREE.MathUtils.clamp((t - a.t) / (b.t - a.t), 0, 1));
  return {
    hands: a.hands.clone().lerp(b.hands, k),
    rot: a.rot.clone().lerp(b.rot, k),
    torso: THREE.MathUtils.lerp(a.torso, b.torso, k),
    lean: THREE.MathUtils.lerp(a.lean, b.lean, k),
  };
}

function makeStickerTexture() {
  const c = document.createElement("canvas");
  c.width = 64; c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0b0d16"; g.fillRect(0, 0, 64, 256);
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, "#7c8fff"); grd.addColorStop(1, "#a78bfa");
  g.fillStyle = grd; g.fillRect(4, 4, 56, 248);
  g.fillStyle = "#0b0d16"; g.fillRect(8, 8, 48, 240);
  g.save(); g.translate(32, 128); g.rotate(-Math.PI / 2);
  g.fillStyle = "#ffffff"; g.font = "bold 34px Arial Black, Arial, sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("DAROCH", 0, 2);
  g.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function Cricketer({ onShot, handleRef, autoPlayFirst = true }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onShotRef = useRef(onShot);
  useEffect(() => { onShotRef.current = onShot; }, [onShot]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 768;

    // ── Renderer / scene / camera ────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.background = BG;
    scene.fog = new THREE.Fog(BG, 6, 14);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
    const camBase = new THREE.Vector3(0.15, 1.5, 5.0);
    const lookAt = new THREE.Vector3(0, 1.02, 0);
    camera.position.copy(camBase);

    // ── Lights: floodlight key + neon rims ───────────────────────────────────
    scene.add(new THREE.HemisphereLight(0x9aa8ff, 0x07080d, 0.55));
    const key = new THREE.DirectionalLight(0xfff1dc, 2.4);
    key.position.set(2.5, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -3; key.shadow.camera.right = 3;
    key.shadow.camera.top = 3; key.shadow.camera.bottom = -3;
    key.shadow.bias = -0.0005;
    key.shadow.radius = 4;
    scene.add(key);
    const rimA = new THREE.PointLight(ACCENT, 26, 10, 2); rimA.position.set(-2.4, 2.2, -1.6); scene.add(rimA);
    const rimB = new THREE.PointLight(PURPLE, 22, 10, 2); rimB.position.set(2.6, 1.6, -1.8); scene.add(rimB);
    const fill = new THREE.PointLight(0xffffff, 4, 8, 2); fill.position.set(0, 1.4, 3); scene.add(fill);
    const flash = new THREE.PointLight(0xffe2b0, 0, 2.5, 2); scene.add(flash);

    // ── Ground: dark disc, pitch strip, creases, neon rings ──────────────────
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(4.2, 64),
      new THREE.MeshStandardMaterial({ color: 0x0d1019, roughness: 0.95, metalness: 0 })
    );
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

    const pitch = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 7),
      new THREE.MeshStandardMaterial({ color: 0x2a2820, roughness: 1 })
    );
    pitch.rotation.x = -Math.PI / 2; pitch.position.set(0, 0.002, 1.2); pitch.receiveShadow = true; scene.add(pitch);

    const creaseMat = new THREE.MeshBasicMaterial({ color: 0xdfe4ff });
    const addLine = (w: number, d: number, x: number, z: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), creaseMat);
      m.rotation.x = -Math.PI / 2; m.position.set(x, 0.004, z); scene.add(m);
    };
    addLine(2.2, 0.025, 0, 0.55);   // popping crease
    addLine(1.2, 0.025, 0, -0.62);  // bowling crease
    addLine(0.025, 1.1, -0.66, 0.0); addLine(0.025, 1.1, 0.66, 0.0); // return creases

    const ringMat = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(2.05, 2.08, 128), ringMat);
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.006; scene.add(ring);
    const ringArcs = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const arc = new THREE.Mesh(
        new THREE.RingGeometry(2.25, 2.3, 48, 1, (i / 6) * Math.PI * 2, Math.PI / 5),
        new THREE.MeshBasicMaterial({ color: i % 2 ? PURPLE : ACCENT, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
      );
      ringArcs.add(arc);
    }
    ringArcs.rotation.x = -Math.PI / 2; ringArcs.position.y = 0.007; scene.add(ringArcs);

    // ── Stumps with glowing LED bails ────────────────────────────────────────
    const stumps = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xe5cf9f, roughness: 0.55 });
    const bailMat = new THREE.MeshStandardMaterial({ color: 0x222233, emissive: ACCENT, emissiveIntensity: 2.2 });
    for (const x of [-0.11, 0, 0.11]) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.72, 12), woodMat);
      s.position.set(x, 0.36, 0); s.castShadow = true; stumps.add(s);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 12), bailMat);
      tip.position.set(x, 0.02, 0); stumps.add(tip);
    }
    for (const x of [-0.055, 0.055]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), bailMat);
      b.rotation.z = Math.PI / 2; b.position.set(x, 0.73, 0); stumps.add(b);
    }
    stumps.position.set(-0.05, 0, -0.62);
    scene.add(stumps);

    // ── Floating floodlight dust ─────────────────────────────────────────────
    const DUST = isSmall ? 160 : 360;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST * 3);
    const dustSpeed = new Float32Array(DUST);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 9;
      dustPos[i * 3 + 1] = Math.random() * 5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
      dustSpeed[i] = 0.05 + Math.random() * 0.15;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      color: 0xaab6ff, size: 0.025, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }));
    scene.add(dust);

    // ── The batter ───────────────────────────────────────────────────────────
    const skin = new THREE.MeshStandardMaterial({ color: 0xb07650, roughness: 0.55 });
    const jersey = new THREE.MeshStandardMaterial({ color: 0x252b63, roughness: 0.5, metalness: 0.1 });
    const trouser = new THREE.MeshStandardMaterial({ color: 0x2c3358, roughness: 0.6 });
    const white = new THREE.MeshStandardMaterial({ color: 0xd9d6cc, roughness: 0.7 });
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x141833, roughness: 0.25, metalness: 0.55 });
    const metal = new THREE.MeshStandardMaterial({ color: 0xc9cede, roughness: 0.25, metalness: 0.95 });
    const glow = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: ACCENT, emissiveIntensity: 2.4 });
    const glowPurple = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: PURPLE, emissiveIntensity: 2.0 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x0b0c12, roughness: 0.4 });

    const cast = <T extends THREE.Object3D>(o: T) => { o.traverse(c => { if ((c as THREE.Mesh).isMesh) { c.castShadow = true; } }); return o; };

    const root = new THREE.Group();
    root.rotation.y = -0.22;
    root.position.set(0.05, 0, 0.1);
    scene.add(root);

    const body = new THREE.Group(); // bobbing + lean
    root.add(body);

    // Legs + pads + shoes
    const makeLeg = (x: number) => {
      const leg = new THREE.Group();
      const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.32, 6, 12), trouser);
      thigh.position.set(0, 0.74, 0); leg.add(thigh);
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.12, 1, 1, 1), white);
      pad.position.set(0, 0.34, 0.055); leg.add(pad);
      for (const px of [-0.06, 0, 0.06]) {
        const ridge = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.42, 4, 8), white);
        ridge.position.set(px, 0.34, 0.12); leg.add(ridge);
      }
      const kneeRoll = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.14, 4, 8), white);
      kneeRoll.rotation.z = Math.PI / 2; kneeRoll.position.set(0, 0.6, 0.1); leg.add(kneeRoll);
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.205, 0.025, 0.125), glow);
      strap.position.set(0, 0.46, 0.056); leg.add(strap);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.28), white);
      shoe.position.set(0, 0.04, 0.05); leg.add(shoe);
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.02, 0.285), dark);
      sole.position.set(0, 0.005, 0.05); leg.add(sole);
      leg.position.x = x;
      return cast(leg);
    };
    const legL = makeLeg(0.15); legL.rotation.y = 0.18; body.add(legL);
    const legR = makeLeg(-0.15); legR.rotation.y = -0.1; body.add(legR);

    const hips = cast(new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.12, 6, 16), trouser));
    hips.rotation.z = Math.PI / 2; hips.scale.set(1, 1, 0.8); hips.position.y = 0.95; body.add(hips);

    // Torso (rotates with swing + cursor)
    const torso = new THREE.Group();
    torso.position.y = 1.0;
    body.add(torso);
    const chest = cast(new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.24, 8, 20), jersey));
    chest.position.y = 0.32; chest.scale.set(1.05, 1, 0.72); torso.add(chest);
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.215, 0.012, 8, 40, Math.PI), glow);
    stripe.position.set(0, 0.36, 0); stripe.rotation.set(0, 0, 0.35); stripe.scale.set(1.05, 1, 0.74); torso.add(stripe);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 24), glowPurple);
    collar.rotation.x = Math.PI / 2; collar.position.y = 0.6; torso.add(collar);
    const neck = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.065, 0.12, 12), skin));
    neck.position.y = 0.64; torso.add(neck);

    // Head + helmet
    const head = new THREE.Group();
    head.position.y = 0.66;
    head.scale.setScalar(1.35);
    torso.add(head);
    const skull = cast(new THREE.Mesh(new THREE.SphereGeometry(0.125, 32, 24), skin));
    skull.position.y = 0.1; skull.scale.set(0.95, 1.05, 1); head.add(skull);

    const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.25 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 });
    const eyes: THREE.Group[] = [];
    for (const x of [-0.045, 0.045]) {
      const eye = new THREE.Group();
      const w = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 12), eyeWhite);
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 8), pupilMat);
      p.position.z = 0.016; eye.add(w, p);
      eye.position.set(x, 0.115, 0.108);
      head.add(eye); eyes.push(eye);
    }
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), skin);
    nose.position.set(0, 0.08, 0.125); head.add(nose);
    const beard = new THREE.Mesh(new THREE.SphereGeometry(0.118, 24, 16, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.35), dark);
    beard.position.y = 0.1; beard.scale.set(0.98, 1.06, 1.03); head.add(beard);

    const helmet = new THREE.Group();
    helmet.position.y = 0.1;
    head.add(helmet);
    const shell = cast(new THREE.Mesh(new THREE.SphereGeometry(0.155, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.52), helmetMat));
    shell.rotation.x = -0.28; shell.position.set(0, 0.005, -0.012); helmet.add(shell);
    const peak = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.012, 32, 1, false, -Math.PI * 0.32, Math.PI * 0.64), helmetMat));
    peak.position.set(0, 0.045, 0.02); peak.rotation.x = 0.18; helmet.add(peak);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.152, 0.009, 8, 48), glow);
    band.rotation.x = Math.PI / 2 - 0.28; band.position.set(0, 0.0, -0.01); helmet.add(band);
    // grille: horizontal arcs + centre bar
    for (const [y, r] of [[-0.03, 0.163], [-0.075, 0.158], [-0.12, 0.145]] as const) {
      const arc = Math.PI * 0.62;
      const g = new THREE.TorusGeometry(r, 0.006, 6, 24, arc);
      g.rotateZ(Math.PI / 2 - arc / 2);
      g.rotateX(Math.PI / 2);
      const bar = new THREE.Mesh(g, metal);
      bar.position.y = y;
      helmet.add(bar);
    }
    const vbar = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.1, 6), metal);
    vbar.position.set(0, -0.075, 0.162); helmet.add(vbar);

    // Shoulders (arm roots) live on the torso
    const shoulderL = new THREE.Object3D(); shoulderL.position.set(0.25, 0.47, 0.02); torso.add(shoulderL);
    const shoulderR = new THREE.Object3D(); shoulderR.position.set(-0.25, 0.47, 0.02); torso.add(shoulderR);
    for (const s of [shoulderL, shoulderR]) {
      const pad = cast(new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), jersey));
      s.add(pad);
    }

    // Bat (pivot = bottom hand). Handle up +Y, blade down -Y.
    const bat = new THREE.Group();
    root.add(bat);
    const willow = new THREE.MeshStandardMaterial({ color: 0xe6c893, roughness: 0.45 });
    const grip = new THREE.MeshStandardMaterial({ color: 0x1b1f3a, roughness: 0.8, emissive: ACCENT, emissiveIntensity: 0.25 });
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.017, 0.3, 12), grip);
    handle.position.y = 0.06; bat.add(handle);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.6, 0.032), willow);
    blade.position.y = -0.4; bat.add(blade);
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.022, 0.52, 3), willow);
    spine.rotation.y = Math.PI / 6; spine.scale.z = 0.8; spine.position.set(0, -0.42, -0.025); bat.add(spine);
    const toe = new THREE.Mesh(new THREE.CylinderGeometry(0.0525, 0.0525, 0.032, 16, 1, false, Math.PI / 2, Math.PI), willow);
    toe.rotation.x = Math.PI / 2; toe.position.y = -0.7; bat.add(toe);
    const sticker = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.3), new THREE.MeshStandardMaterial({ map: makeStickerTexture(), roughness: 0.4, emissive: 0xffffff, emissiveIntensity: 0.05 }));
    sticker.position.set(0, -0.36, 0.0165); bat.add(sticker);
    const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.053, 0.03, 0.06, 16), willow);
    shoulder.position.y = -0.08; shoulder.scale.z = 0.35; bat.add(shoulder);
    cast(bat);

    // Arms: rebuilt every frame between shoulders and hands
    const armMat = jersey;
    const foreMat = skin;
    const seg = () => cast(new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 12), armMat));
    const segF = () => cast(new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 12), foreMat));
    const upperL = seg(), upperR = seg(), lowerL = segF(), lowerR = segF();
    const elbowL = cast(new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), skin));
    const elbowR = cast(new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), skin));
    const gloveGeo = new THREE.BoxGeometry(0.1, 0.085, 0.1);
    const gloveL = cast(new THREE.Mesh(gloveGeo, white));
    const gloveR = cast(new THREE.Mesh(gloveGeo, white));
    const cuffL = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.03, 12), glow);
    const cuffR = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.03, 12), glow);
    root.add(upperL, upperR, lowerL, lowerR, elbowL, elbowR, gloveL, gloveR, cuffL, cuffR);

    const UP = new THREE.Vector3(0, 1, 0);
    const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3();
    const placeSeg = (m: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, r: number) => {
      tmpC.subVectors(b, a);
      const len = tmpC.length();
      m.position.copy(a).addScaledVector(tmpC, 0.5);
      m.quaternion.setFromUnitVectors(UP, tmpC.normalize());
      m.scale.set(r, len, r);
    };
    const ARM = 0.36;
    const solveArm = (s: THREE.Vector3, h: THREE.Vector3, side: number, upper: THREE.Mesh, lower: THREE.Mesh, elbow: THREE.Mesh) => {
      const d = s.distanceTo(h);
      const mid = tmpA.addVectors(s, h).multiplyScalar(0.5);
      const dir = tmpB.subVectors(h, s).normalize();
      const out = new THREE.Vector3(side, -0.6, -0.25).normalize();
      out.addScaledVector(dir, -out.dot(dir)).normalize();
      const bend = d < ARM * 2 ? Math.sqrt(ARM * ARM - (d / 2) * (d / 2)) : 0;
      const e = mid.clone().addScaledVector(out, bend);
      placeSeg(upper, s, e, 0.058);
      placeSeg(lower, e, h, 0.045);
      elbow.position.copy(e);
    };

    const toRoot = (o: THREE.Object3D, local: THREE.Vector3) => root.worldToLocal(o.localToWorld(local.clone()));

    // ── Bat trail ribbon ─────────────────────────────────────────────────────
    const TRAIL = 22;
    const trailPos = new Float32Array(TRAIL * 2 * 3);
    const trailCol = new Float32Array(TRAIL * 2 * 3);
    const trailIdx: number[] = [];
    for (let i = 0; i < TRAIL - 1; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      trailIdx.push(a, b, c, b, d, c);
    }
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute("color", new THREE.BufferAttribute(trailCol, 3));
    trailGeo.setIndex(trailIdx);
    const trail = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }));
    trail.frustumCulled = false;
    scene.add(trail);
    const trailHist: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];

    // ── Balls in flight ──────────────────────────────────────────────────────
    const ballGeo = new THREE.SphereGeometry(0.036, 20, 14);
    const ballMat = new THREE.MeshStandardMaterial({ color: BALL_RED, emissive: BALL_RED, emissiveIntensity: 1.6, roughness: 0.35 });
    const seamGeo = new THREE.TorusGeometry(0.036, 0.004, 6, 24);
    const seamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    type Ball = { mesh: THREE.Group; vel: THREE.Vector3; life: number; ghosts: THREE.Mesh[]; hist: THREE.Vector3[] };
    const balls: Ball[] = [];
    const ghostMat = new THREE.MeshBasicMaterial({ color: 0xff5040, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
    const shockwaves: { mesh: THREE.Mesh; life: number }[] = [];

    const launchBall = (from: THREE.Vector3) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(ballGeo, ballMat));
      const seam = new THREE.Mesh(seamGeo, seamMat); seam.rotation.y = Math.PI / 2; g.add(seam);
      g.position.copy(from);
      scene.add(g);
      const aim = pointer.x;
      const vel = new THREE.Vector3(
        THREE.MathUtils.clamp(aim * 4 + (Math.random() - 0.5) * 1.5, -5, 5),
        6.2 + Math.random() * 2,
        1.2 + Math.random() * 1.2
      );
      const ghosts: THREE.Mesh[] = [];
      for (let i = 0; i < 10; i++) {
        const m = new THREE.Mesh(ballGeo, ghostMat.clone());
        (m.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - i / 10);
        m.scale.setScalar(1 - i * 0.07);
        m.visible = false;
        scene.add(m); ghosts.push(m);
      }
      balls.push({ mesh: g, vel, life: 3, ghosts, hist: [] });

      const sw = new THREE.Mesh(
        new THREE.RingGeometry(0.04, 0.05, 48),
        new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 1, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      sw.position.copy(from); sw.lookAt(camera.position);
      scene.add(sw); shockwaves.push({ mesh: sw, life: 1 });
      flash.position.copy(from); flash.intensity = 3;
    };

    // ── Post-processing (bloom = the neon glow) ──────────────────────────────
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.5, 0.78);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // ── Sizing ───────────────────────────────────────────────────────────────
    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      composer.setSize(w, h);
      bloom.resolution.set(w / 2, h / 2);
      camera.aspect = w / h;
      // pull back on tall/narrow frames so the full batter stays in view
      camBase.z = w / h < 0.9 ? 6.2 : 5.0;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    // ── Pointer tracking (anywhere on the page) ──────────────────────────────
    const pointer = new THREE.Vector2(0.4, 0.1);
    const pointerTarget = new THREE.Vector2(0.4, 0.1);
    const onPointerMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      pointerTarget.set(
        THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -2.5, 2.5),
        THREE.MathUtils.clamp(-(((e.clientY - r.top) / r.height) * 2 - 1), -2.5, 2.5)
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ── Swing state ──────────────────────────────────────────────────────────
    let swingT = -1; // <0 = idle
    let contactDone = false;
    const playShot = () => { if (swingT < 0) { swingT = 0; contactDone = false; } };
    if (handleRef) handleRef.current = { playShot };
    const onClick = () => playShot();
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.style.cursor = "pointer";
    let autoTimer: number | undefined;
    if (autoPlayFirst && !reduceMotion) autoTimer = window.setTimeout(playShot, 1600);

    // ── Visibility: pause when offscreen ─────────────────────────────────────
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(mount);

    // ── Animation loop ───────────────────────────────────────────────────────
    const timer = new THREE.Timer();
    const lookTarget = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const facePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.4);
    const dummy = new THREE.Object3D();
    let blinkT = 2 + Math.random() * 3;
    let raf = 0;
    let elapsed = 0;

    const tick = (time?: number) => {
      raf = requestAnimationFrame(tick);
      timer.update(time);
      const dt = Math.min(timer.getDelta(), 0.05);
      if (!visible) return;
      elapsed += dt;

      pointer.lerp(pointerTarget, 1 - Math.pow(0.001, dt));

      // camera parallax
      camera.position.set(camBase.x + pointer.x * 0.28, camBase.y + pointer.y * 0.14, camBase.z);
      camera.lookAt(lookAt);

      // where is the cursor in the world? (intersect a plane in front of the batter)
      raycaster.setFromCamera(pointer, camera);
      if (!raycaster.ray.intersectPlane(facePlane, lookTarget)) lookTarget.set(0, 1.6, 1.4);
      lookTarget.y = THREE.MathUtils.clamp(lookTarget.y, 0.6, 3.2);

      // swing
      let pose = sampleSwing(0);
      if (swingT >= 0) {
        swingT += dt / SWING_DURATION;
        if (!contactDone && swingT >= CONTACT_T) {
          contactDone = true;
          const sweet = bat.localToWorld(new THREE.Vector3(0, -0.5, 0.03));
          launchBall(sweet);
          const r = [4, 6, 6, 4, 6, 2, 4, 6, 1][Math.floor(Math.random() * 9)];
          onShotRef.current?.(r);
        }
        if (swingT >= 1) swingT = -1;
        else pose = sampleSwing(swingT);
      }

      // idle breathing + bat tap
      const idle = swingT < 0;
      const breathe = Math.sin(elapsed * 2.1) * 0.008;
      body.position.y = breathe;
      body.rotation.x = pose.lean;
      if (idle && !reduceMotion) {
        const tap = Math.max(0, Math.sin(elapsed * 3.2)) ** 6;
        pose.hands.y += tap * 0.05;
        pose.rot.x -= tap * 0.12;
      }

      // torso follows the swing + a little of the cursor
      const cursorYaw = THREE.MathUtils.clamp(pointer.x * 0.5, -0.5, 0.5);
      torso.rotation.y = THREE.MathUtils.lerp(torso.rotation.y, pose.torso + (idle ? cursorYaw * 0.35 : 0), 1 - Math.pow(0.0005, dt));

      // head looks at cursor (smoothed, clamped)
      dummy.position.copy(head.position);
      torso.add(dummy);
      dummy.lookAt(lookTarget);
      const e = new THREE.Euler().setFromQuaternion(dummy.quaternion, "YXZ");
      e.y = THREE.MathUtils.clamp(e.y, -1.0, 1.0);
      e.x = THREE.MathUtils.clamp(e.x, -0.5, 0.45);
      e.z = 0;
      dummy.quaternion.setFromEuler(e);
      head.quaternion.slerp(dummy.quaternion, 1 - Math.pow(0.002, dt));
      torso.remove(dummy);

      // eyes: pupils drift a touch further toward the cursor, plus blinking
      blinkT -= dt;
      const blink = blinkT < 0 ? 0.1 : 1;
      if (blinkT < -0.12) blinkT = 2.5 + Math.random() * 3.5;
      for (const eye of eyes) {
        eye.scale.y = blink;
        eye.rotation.y = THREE.MathUtils.clamp(pointer.x * 0.35, -0.4, 0.4);
        eye.rotation.x = THREE.MathUtils.clamp(-pointer.y * 0.25, -0.3, 0.3);
      }

      // bat + arms
      bat.position.copy(pose.hands);
      bat.rotation.set(pose.rot.x, pose.rot.y, pose.rot.z);
      root.updateMatrixWorld(true);
      const topHand = toRoot(bat, new THREE.Vector3(0, 0.1, 0));
      const botHand = toRoot(bat, new THREE.Vector3(0, 0.0, 0));
      const sL = toRoot(shoulderL, new THREE.Vector3());
      const sR = toRoot(shoulderR, new THREE.Vector3());
      // left (top) hand is higher on the handle for a right-hander
      solveArm(sL, topHand, 1, upperL, lowerL, elbowL);
      solveArm(sR, botHand, -1, upperR, lowerR, elbowR);
      gloveL.position.copy(topHand); gloveL.quaternion.copy(bat.quaternion);
      gloveR.position.copy(botHand); gloveR.quaternion.copy(bat.quaternion);
      const cuffOff = new THREE.Vector3(0, 0.055, 0).applyQuaternion(bat.quaternion);
      cuffL.position.copy(topHand).add(cuffOff); cuffL.quaternion.copy(bat.quaternion);
      cuffR.position.copy(botHand).sub(cuffOff); cuffR.quaternion.copy(bat.quaternion);

      // trail ribbon from blade
      const bMid = bat.localToWorld(new THREE.Vector3(0, -0.4, 0));
      const bTip = bat.localToWorld(new THREE.Vector3(0, -0.72, 0));
      trailHist.unshift({ a: bMid, b: bTip });
      if (trailHist.length > TRAIL) trailHist.pop();
      const swingPower = idle ? 0 : Math.sin(Math.min(1, Math.max(0, swingT)) * Math.PI);
      for (let i = 0; i < TRAIL; i++) {
        const h = trailHist[Math.min(i, trailHist.length - 1)];
        trailPos.set([h.a.x, h.a.y, h.a.z], i * 6);
        trailPos.set([h.b.x, h.b.y, h.b.z], i * 6 + 3);
        const f = Math.pow(1 - i / TRAIL, 2.2) * swingPower * 0.55;
        trailCol.set([ACCENT.r * f * 0.3, ACCENT.g * f * 0.3, ACCENT.b * f * 0.3], i * 6);
        trailCol.set([PURPLE.r * f * 1.3, PURPLE.g * f * 1.1, PURPLE.b * f * 1.4], i * 6 + 3);
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.color.needsUpdate = true;

      // balls
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.vel.y -= 9.8 * dt * 0.8;
        b.mesh.position.addScaledVector(b.vel, dt);
        b.mesh.rotation.x += dt * 25;
        b.hist.unshift(b.mesh.position.clone());
        if (b.hist.length > 20) b.hist.pop();
        b.ghosts.forEach((g, gi) => {
          const p = b.hist[gi * 2];
          if (p) { g.visible = true; g.position.copy(p); }
        });
        b.life -= dt;
        if (b.life <= 0) {
          scene.remove(b.mesh);
          b.ghosts.forEach(g => { scene.remove(g); (g.material as THREE.Material).dispose(); });
          balls.splice(i, 1);
        }
      }
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const s = shockwaves[i];
        s.life -= dt * 2.2;
        const k = 1 - s.life;
        s.mesh.scale.setScalar(1 + k * 5);
        (s.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, s.life) * 0.6;
        if (s.life <= 0) { scene.remove(s.mesh); s.mesh.geometry.dispose(); (s.mesh.material as THREE.Material).dispose(); shockwaves.splice(i, 1); }
      }
      flash.intensity *= Math.pow(0.005, dt);

      // stage
      ringArcs.rotation.z += dt * 0.25;
      ringMat.opacity = 0.55 + Math.sin(elapsed * 1.6) * 0.25;
      bailMat.emissiveIntensity = 1.8 + Math.sin(elapsed * 3) * 0.6 + (flash.intensity > 0.5 ? 3 : 0);
      const dp = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < DUST; i++) {
        dp[i * 3 + 1] += dustSpeed[i] * dt;
        dp[i * 3] += Math.sin(elapsed * 0.5 + i) * dt * 0.02;
        if (dp[i * 3 + 1] > 5) dp[i * 3 + 1] = 0;
      }
      dustGeo.attributes.position.needsUpdate = true;

      composer.render();
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      if (autoTimer) clearTimeout(autoTimer);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("click", onClick);
      if (handleRef) handleRef.current = null;
      scene.traverse(o => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach(x => x.dispose()); else mat?.dispose();
      });
      composer.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [handleRef, autoPlayFirst]);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} aria-label="Interactive 3D cricketer. Move your cursor and he watches it; click to play a shot." role="img" />;
}
