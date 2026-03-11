import gardenersGrove from "../assets/gardeners-grove.png";
import scrumboard from "../assets/scrumboard.png";
import cycleways from "../assets/cycleways.png";
import petitions from "../assets/petitions.png";
import autoencoder from "../assets/autoencoder.png";
import nft from "../assets/nft.png";
import ucisa from "../assets/ucisa.png";
import csseChatbot from "../assets/csse-chatbot.png";
import speedWash from "../assets/SpeedWash.png";

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
    title: "Speedwash",
    description:
      "Full-stack SaaS platform for a car wash business, built for a private client in India. Customers can register, book appointments, and manage their vehicle history. Admins have a separate dashboard to manage bookings, services, users, and editable page content. The React frontend and Node.js/Express REST API are independently containerised with Docker and deployed to Azure Container Apps via Azure Container Registry. CI/CD pipelines in GitLab automate build, push, and deployment on every commit. Auth uses JWT access and refresh token rotation with role-based access control. Database is PostgreSQL hosted on Neon serverless, accessed via Sequelize ORM.",
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
    image:speedWash,
    link: "https://speedwash-frontend.lemonsmoke-1403fb9d.uksouth.azurecontainerapps.io",
  },

  {
    id: 1,
    title: "Image Autoencoder",
    description:
      "Deep learning autoencoder that reconstructs denoised images using convolutional and transpose convolutional layers.",
    tech: ["Python", "TensorFlow", "Keras", "NumPy", "Matplotlib"],
    uni: true,
    image: autoencoder,
    github: "https://github.com/udaydaroch/DeepLearning",
  },

  {
    id: 2,
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
    id: 3,
    title: "NFT Marketplace",
    description:
      "Smart contract enabling listing, purchasing, and managing NFTs with public/private metadata on Secret Network.",
    tech: ["Rust", "Secret Network", "Blockchain", "react", "Vite", "node.js", "docker", "rustc"],
    uni: true,
    image: nft,
    github: "https://github.com/udaydaroch/NFT-marketplace",
  },

  {
    id: 4,
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
    id: 5,
    title: "Gardeners Grove",
    description:
      "Social gardening platform enabling users to manage gardens, share content, add plants, follow, and explore public gardens.",
    tech: ["Spring Boot", "Thymeleaf", "SQL"],
    uni: true,
    image: gardenersGrove,
    github: "",
  },

  {
    id: 6,
    title: "Cycleways",
    description:
      "A mapping application built with JavaFX and geospatial APIs to visualize crash data, cluster markers, and explore cycle routes.",
    tech: ["JavaFX", "SQLite", "Leaflet", "GraphHopper API", "OpenStreetMap"],
    uni: true,
    image: cycleways,
    github: "https://github.com/udaydaroch/Cycleways",
  },

  {
    id: 7,
    title: "Petitions App",
    description:
      "A full SPA supporting petition creation, user accounts, login, supporting petitions, and more. Fully API-driven backend.",
    tech: ["React", "TypeScript", "Node.js", "Express", "SQL", "MUI"],
    uni: true,
    image: petitions,
  },

  {
    id: 8,
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