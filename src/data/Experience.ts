import ubiikImg from "../assets/ubiik.png";
import fleetpinImg from "../assets/fleetpin.png";
import tutorImg from "../assets/tutor.png";

export type FilterKey = "all" | "engineering" | "service" | "community";

export interface Experience {
  id: string;
  category: FilterKey[];
  modalTarget: string;
  image?: string;
  iconClass?: string;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  period: string;
  badges: string[];
  bullets: string[];
  /** Short one-liner used on the home page */
  blurb: string;
  /** Currently at the crease? */
  current?: boolean;
  /** Accent colour used for glows on the home page */
  glow: string;
}

// Most recent first
export const experiences: Experience[] = [
  {
    id: "ubiik", category: ["engineering"], modalTarget: "#ubiikModal", image: ubiikImg,
    title: "Software Engineering Intern", subtitle: "Ubiik Mimomax", period: "2025 – 2026",
    badges: ["Laravel", "PHP", "Bootstrap 5", "Docker", "SQLite / PostgreSQL"],
    bullets: ["Modernising UI from Bootstrap 3 → 5.", "Building tools to manage SQLite configuration files.", "Extending Laravel modules and reusable API workflows.", "Working across Dockerised SQL data pipelines."],
    blurb: "Industrial IoT. Building out Konfig, the internal tool behind purchase orders and device configs, and dragging its UI from Bootstrap 3 into the present.",
    glow: "#7c8fff",
  },
  {
    id: "fleetpin", category: ["engineering"], modalTarget: "#fleetpinModal", image: fleetpinImg,
    title: "Software Engineering Intern", subtitle: "Fleetpin", period: "2024 – 2025",
    badges: ["Vue.js", "REST APIs", "Service Workers", "SQL", "Scala"],
    bullets: ["Optimised batch queries for GPS tracking.", "Integrated backend APIs for smoother flows.", "Implemented offline mode through service workers.", "Fixed UI bugs and improved critical UX paths."],
    blurb: "GPS fleet tracking. Sped up batch queries, wired in backend APIs and shipped an offline mode on service workers.",
    glow: "#5cc8ff",
  },
  {
    id: "tutor", category: ["engineering", "community"], modalTarget: "#tutorModal", image: tutorImg,
    title: "Programming Tutor", subtitle: "University of Canterbury · COSC121 & COSC131", period: "2025",
    badges: ["Python", "Problem Solving", "Teaching"],
    bullets: ["Taught programming fundamentals step-by-step.", "Helped debug student code and improve reasoning.", "Supported labs, assignments, and tutorials.", "Helped run bootcamps and exam prep sessions."],
    blurb: "Coaching the next batch. Labs, debugging sessions, bootcamps and exam prep for first-year Python.",
    glow: "#a78bfa",
  },
  {
    id: "isa", category: ["community"], modalTarget: "#isaModal",
    iconClass: "bi bi-people-fill", iconBg: "rgba(124,143,255,0.08)", iconColor: "#9aabff",
    title: "General Executive", subtitle: "Indian Student Association · UC", period: "2024",
    badges: ["Event Planning", "Marketing"],
    bullets: ["Coordinated cultural events and socials.", "Handled event marketing and promotion.", "Collaborated with exec team on logistics."],
    blurb: "Ran cultural events and socials for UC's Indian Student Association, from the posters to the logistics.",
    glow: "#f0a24a",
  },
  {
    id: "pizzahut", category: ["service"], modalTarget: "#pizzaHutModal",
    iconClass: "bi bi-bicycle", iconBg: "rgba(220,80,60,0.08)", iconColor: "#e07060",
    title: "Delivery Driver", subtitle: "Pizza Hut", period: "Oct 2023 – Jun 2024",
    badges: ["Delivery", "Customer Service"],
    bullets: ["Prepared food in a fast-paced kitchen.", "Delivered orders accurately and on time.", "Managed stock and food safety standards."],
    blurb: "Quick between the wickets. Fast kitchen, faster deliveries, every order out hot and on time.",
    glow: "#ff5a4e",
  },
  {
    id: "paknsave", category: ["service"], modalTarget: "#paknsaveModal",
    iconClass: "bi bi-cart-fill", iconBg: "rgba(180,140,0,0.08)", iconColor: "#c9a84c",
    title: "Grocery Assistant", subtitle: "PAK'nSAVE", period: "Dec 2020 – Aug 2021",
    badges: ["Teamwork", "Stock Management"],
    bullets: ["Rotated and replenished stock.", "Assisted customers with in-store needs.", "Kept store clean and well-organised."],
    blurb: "Stock rotation, customer help and keeping a busy supermarket floor running clean.",
    glow: "#e8c347",
  },
  {
    id: "saket", category: ["service"], modalTarget: "#saketModal",
    iconClass: "bi bi-cup-hot-fill", iconBg: "rgba(190,90,40,0.08)", iconColor: "#d4845a",
    title: "Waiter Staff", subtitle: "Saket Indian Restaurant", period: "2017 – 2019",
    badges: ["Table Service", "Delivery"],
    bullets: ["Welcomed guests and managed table service.", "Handled orders, counter, and deliveries.", "Supported kitchen and food prep duties."],
    blurb: "The opening spell. Table service, the counter, deliveries and kitchen support, where it all started.",
    glow: "#ff8f5a",
  },
];
