import type { Project } from "../../data/Projects";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="card h-100 shadow-sm position-relative project-card">
      <div className="card-body d-flex flex-column">

        <h5 className="card-title project-card-title justify-content-center d-flex">{project.title}</h5>
        <hr className="project-divider" />
        <div className="d-flex justify-content-center">
        {project.image && (
            <img
            style={{ borderWidth: 2, borderStyle: "solid", borderColor: "#ddd", borderRadius: 8 }}
            src={project.image}
            alt={project.title}
            className="project-image mb-3"
            />
        )}
        </div>

       

        <p className="card-text project-card-text">
          {project.description}
        </p>

        <div className="mb-3">
          {project.tech.map((t) => (
            <span
              key={t}
              className="badge rounded-pill me-1 mb-1 project-tech-badge"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto d-flex gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-dark flex-grow-1"
            >
              GitHub
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-primary flex-grow-1"
            >
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
