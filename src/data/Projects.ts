export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  uni?: boolean; // <-- marks university projects
  image?: string;
}
export const projects: Project[] = [
  {
    id: 1,
    title: "Gardeners Grove",
    description:
      "Social gardening platform enabling users to manage gardens, share content, add plants, follow friends, and explore public gardens.",
    tech: ["Spring Boot", "Thymeleaf", "SQL"],
    uni: true,
    image: "/gardeners-grove.png",
    github:""
  },

  {
    id: 2,
    title: "Scrumboard System",
    description:
      "Kanban-style Scrumboard tool with task assignment, roles, sub-tasks, drag-and-drop boards, and progress tracking.",
    tech: ["React", "Node.js", "Express", "NeonDB", "Drag & Drop"],
    uni: true,
    image: "/scrumboard.png",
    github:"https://github.com/udaydaroch/ScrumboardProject"
  },

  {
    id: 3,
    title: "Cycleways",
    description:
      "A mapping application built with JavaFX and geospatial APIs to visualize crash data, cluster markers, and explore cycle routes.",
    tech: ["JavaFX", "SQLite", "Leaflet", "GraphHopper API", "OpenStreetMap"],
    uni: true,
    image: "/cycleways.png",
    github:"https://github.com/udaydaroch/Cycleways"
  },

  {
    id: 4,
    title: "Petitions App",
    description:
      "A full SPA supporting petition creation, user accounts, login, supporting petitions, and more. Fully API-driven backend.",
    tech: ["React", "TypeScript", "Node.js", "Express", "SQL", "MUI"],
    uni: true,
    image: "/petitions.png",
  },

  {
    id: 5,
    title: "Image Autoencoder",
    description:
      "Deep learning autoencoder that reconstructs denoised images using convolutional and transpose convolutional layers.",
    tech: ["Python", "TensorFlow", "Keras", "NumPy", "Matplotlib"],
    uni: true,
    image: "/autoencoder.png",
  },

  {
    id: 6,
    title: "NFT Marketplace",
    description:
      "Smart contract enabling listing, purchasing, and managing NFTs with public/private metadata on Secret Network.",
    tech: ["Rust", "Secret Network", "Blockchain"],
    uni: true,
    image: "/nft.png",
  },
  {
    id: 7,
    title: "UCISA",
    description:
      "Smart contract enabling listing, purchasing, and managing NFTs with public/private metadata on Secret Network.",
    tech: ["Rust", "Secret Network", "Blockchain"],
    uni: true,
    image: "/ucisa.png",
  },
];
