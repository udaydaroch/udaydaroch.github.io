import gardenersGrove from "../assets/gardeners-grove.png";
import scrumboard from "../assets/scrumboard.png";
import cycleways from "../assets/cycleways.png";
import petitions from "../assets/petitions.png";
import autoencoder from "../assets/autoencoder.png";
import nft from "../assets/nft.png";
import ucisa from "../assets/ucisa.png";
import csseChatbot from "../assets/csse-chatbot.png";
import speedWash from "../assets/SpeedWash.png";
import mimiPrism from "../assets/prism.png";

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  uni?: boolean;
  image?: string;
}

export const projects: Project[] = [
  {
    id: 0,
    title: "Mini Prism",
    description:
      "Cloud-native Point of Sale and inventory system built on AWS EKS. Three Spring Boot microservices (auth, inventory, POS) each with their own PostgreSQL database, a React frontend proxied via Nginx, JWT auth, and zero-downtime rolling deployments on Kubernetes.",
    tech: [
      "Java",
      "Spring Boot",
      "React",
      "PostgreSQL",
      "Flyway",
      "Docker",
      "Kubernetes",
      "AWS EKS",
      "AWS ECR",
      "AWS RDS",
      "Terraform",
      "GitHub Actions",
      "Nginx",
      "JWT",
    ],
    link: "http://k8s-prism-prisming-8596357315-1014118624.ap-southeast-2.elb.amazonaws.com",
    github: "https://github.com/udaydaroch/mini-prism",
    image:mimiPrism
  },
  {
    id: 1,
    title: "Speedwash",
    description:
      "Full-stack SaaS car wash platform for a private client in India with customer booking, admin dashboard, and CMS content editing. Deployed on Azure Container Apps via Docker and GitLab CI/CD.",
    tech: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Sequelize",
      "Docker",
      "Azure Container Apps",
      "Azure Container Registry",
      "GitLab CI/CD",
      "JWT",
      "Nginx",
      "Zustand",
    ],
    image: speedWash,
    link: "https://speedwash-frontend.lemonsmoke-1403fb9d.uksouth.azurecontainerapps.io",
  },
  {
    id: 2,
    title: "Image Autoencoder",
    description:
      "Deep learning autoencoder that reconstructs denoised images using convolutional and transpose convolutional layers.",
    tech: ["Python", "TensorFlow", "Keras", "NumPy", "Matplotlib"],
    uni: true,
    image: autoencoder,
    github: "https://github.com/udaydaroch/DeepLearning",
  },
  {
    id: 3,
    title: "CSSE Department Chatbot",
    description:
      "Final-year project building a full-stack chatbot for the CSSE department using a RAG pipeline with open-source Ollama models and BGE-M3 embeddings, including BERTScore-based evaluation and a user study.",
    tech: [
      "Python",
      "Flask",
      "LangChain",
      "Ollama",
      "BGE-M3",
      "ChromaDB",
      "Sqlite",
      "BERTScore",
      "HuggingFace",
      "ChatGPT",
    ],
    uni: true,
    image: csseChatbot,
  },
  {
    id: 4,
    title: "NFT Marketplace",
    description:
      "Smart contract enabling listing, purchasing, and managing NFTs with public/private metadata on Secret Network.",
    tech: ["Rust", "Secret Network", "Blockchain", "react", "Vite", "node.js", "docker", "rustc"],
    uni: true,
    image: nft,
    github: "https://github.com/udaydaroch/NFT-marketplace",
  },
  {
    id: 5,
    title: "Scrumboard System",
    description:
      "Kanban-style Scrumboard tool with task assignment, roles, sub-tasks, drag-and-drop boards, and progress tracking.",
    tech: ["React", "Node.js", "Express", "NeonDB", "Drag & Drop"],
    uni: true,
    image: scrumboard,
    github: "https://github.com/udaydaroch/ScrumboardProject",
    link: "https://scrumboard-project.vercel.app/login",
  },
  {
    id: 6,
    title: "Gardeners Grove",
    description:
      "Social gardening platform enabling users to manage gardens, share content, add plants, follow, and explore public gardens.",
    tech: ["Spring Boot", "Thymeleaf", "SQL"],
    uni: true,
    image: gardenersGrove,
    github: "",
  },
  {
    id: 7,
    title: "Cycleways",
    description:
      "A mapping application built with JavaFX and geospatial APIs to visualize crash data, cluster markers, and explore cycle routes.",
    tech: ["JavaFX", "SQLite", "Leaflet", "GraphHopper API", "OpenStreetMap"],
    uni: true,
    image: cycleways,
    github: "https://github.com/udaydaroch/Cycleways",
  },
  {
    id: 8,
    title: "Petitions App",
    description:
      "A full SPA supporting petition creation, user accounts, login, supporting petitions, and more. Fully API-driven backend.",
    tech: ["React", "TypeScript", "Node.js", "Express", "SQL", "MUI"],
    uni: true,
    image: petitions,
  },
  {
    id: 9,
    title: "UCISA",
    description:
      "A simple SPA for browsing UCISA representatives, built with React and TypeScript.",
    tech: ["Rust", "Secret Network", "Blockchain"],
    uni: true,
    image: ucisa,
    github: "https://github.com/udaydaroch/UCISAgallary",
    link: "https://ucis-agallary.vercel.app/#",
  },
];