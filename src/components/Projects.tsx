import { useState } from "react";
import { projects } from "../data/Projects";
import ProjectCard from "./objects/ProjectCard";
import "./Projects.css";

const PAGE_SIZE = 4;

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(projects.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentProjects = projects.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div
      className="container d-flex flex-column justify-content-center"
    >
      <div className="project-name text-center">Projects</div>

      <div className="row g-3 flex-grow-1">
        {currentProjects.map((project) => (
          <div key={project.id} className="col-md-6 col-lg-3">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <nav className="mt-auto pt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`page-item ${
                page === currentPage ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Projects;
