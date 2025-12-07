import ubiikImg from "../assets/ubiik.png";
import fleetpinImg from "../assets/fleetpin.png";
import tutorImg from "../assets/tutor.png";
import UbiikModal from "./modals/UbiikModal";
import FleetpinModal from "./modals/FleetpinModal";
import TutorModal from "./modals/TutorModal";

const AboutMe = () => {
  return (
    <div className="container py-5">

      <section className="mb-5 text-center text-md-start">
        <h1 className="fw-bold mb-3">About Me</h1>
        <p className="fs-5 text-muted mb-0">
          I’m a software engineer who enjoys building full-stack applications,
          AI tools, and practical systems that actually get used. I like taking
          real problems, breaking them down, and then shipping solutions that
          are clean, understandable, and maintainable.
        </p>
      </section>

      <section>
        <h2 className="h3 fw-semibold mb-2 text-center text-md-start">
          What I’ve been working on
        </h2>

        <p className="text-muted small mb-4 text-center text-md-start">
          👉 Click any card to view more details
        </p>

        <div className="row g-4">

          <div className="col-12 col-md-6 col-lg-4">
            <button
              className="card h-100 rounded-4 border border-2 shadow-lg text-start p-0"
              data-bs-toggle="modal"
              data-bs-target="#ubiikModal"
              style={{ cursor: "pointer", background: "white" }}
            >
              <img
                src={ubiikImg}
                className="card-img-top rounded-top-4"
                style={{ height: "180px", objectFit: "cover" }}
                alt="Ubiik Mimomax"
              />

              <hr className="my-0" />

              <div className="card-body">
                <h5 className="card-title fw-semibold mb-1">Software Engineering Intern</h5>
                <p className="text-muted mb-2">Ubiik Mimomax · 2025 – Present</p>

                <div className="mb-3">
                  <span className="badge bg-light text-dark me-1">Laravel</span>
                  <span className="badge bg-light text-dark me-1">PHP</span>
                  <span className="badge bg-light text-dark me-1">Bootstrap 5</span>
                  <span className="badge bg-light text-dark me-1">Docker</span>
                  <span className="badge bg-light text-dark">SQLite / PostgreSQL</span>
                </div>

                <ul className="small text-muted ps-3 mb-0">
                  <li>Modernising UI from Bootstrap 3 → 5.</li>
                  <li>Building tools to manage SQLite configuration files.</li>
                  <li>Extending Laravel modules + reusable API workflows.</li>
                  <li>Working across Dockerised SQL data pipelines.</li>
                </ul>
              </div>
            </button>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <button
              className="card h-100 rounded-4 border border-2 shadow-lg text-start p-0"
              data-bs-toggle="modal"
              data-bs-target="#fleetpinModal"
              style={{ cursor: "pointer", background: "white" }}
            >
              <img
                src={fleetpinImg}
                className="card-img-top rounded-top-4"
                style={{ height: "180px", objectFit: "cover" }}
                alt="Fleetpin"
              />

              <hr className="my-0" />

              <div className="card-body">
                <h5 className="card-title fw-semibold mb-1">Software Engineering Intern</h5>
                <p className="text-muted mb-2">Fleetpin · 2024 – 2025</p>

                <div className="mb-3">
                  <span className="badge bg-light text-dark me-1">Vue.js</span>
                  <span className="badge bg-light text-dark me-1">REST APIs</span>
                  <span className="badge bg-light text-dark me-1">Service Workers</span>
                  <span className="badge bg-light text-dark me-1">SQL</span>
                  <span className="badge bg-light text-dark">Scala</span>
                </div>

                <ul className="small text-muted ps-3 mb-0">
                  <li>Optimised batch queries for GPS tracking.</li>
                  <li>Integrated backend APIs for smoother flows.</li>
                  <li>Implemented offline mode through service workers.</li>
                  <li>Fixed UI bugs & improved critical UX paths.</li>
                </ul>
              </div>
            </button>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <button
              className="card h-100 rounded-4 border border-2 shadow-lg text-start p-0"
              data-bs-toggle="modal"
              data-bs-target="#tutorModal"
              style={{ cursor: "pointer", background: "white" }}
            >
              <img
                src={tutorImg}
                className="card-img-top rounded-top-4"
                style={{ height: "180px", objectFit: "cover" }}
                alt="Tutoring"
              />

              <hr className="my-0" />

              <div className="card-body">
                <h5 className="card-title fw-semibold mb-1">Programming Tutor</h5>
                <p className="text-muted mb-2">
                  University of Canterbury · COSC121 & COSC131 · 2025
                </p>

                <div className="mb-3">
                  <span className="badge bg-light text-dark me-1">Python</span>
                  <span className="badge bg-light text-dark me-1">Problem Solving</span>
                  <span className="badge bg-light text-dark">Teaching</span>
                </div>

                <ul className="small text-muted ps-3 mb-0">
                  <li>Taught programming fundamentals step-by-step.</li>
                  <li>Helped debug student code and improve reasoning.</li>
                  <li>Supported labs, assignments, and tutorials.</li>
                  <li>Helped run bootcamps & exam prep sessions.</li>
                </ul>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="p-4 p-md-5 bg-light rounded-4 shadow-sm">
          <h2 className="h4 fw-semibold mb-3">How I like to work</h2>
          <p className="mb-0 text-muted">
            Across internships and tutoring, I’ve spent a lot of time reading other people’s code,
            improving existing systems, and explaining ideas clearly. I enjoy owning features
            end-to-end, collaborating with teams, and leaving systems cleaner than I found them.
          </p>
        </div>
      </section>

      {/* Modals */}
      <UbiikModal />
      <FleetpinModal />
      <TutorModal />
    </div>
  );
};

export default AboutMe;
