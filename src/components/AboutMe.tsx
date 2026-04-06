import ubiikImg from "../assets/ubiik.png";
import fleetpinImg from "../assets/fleetpin.png";
import tutorImg from "../assets/tutor.png";
import UbiikModal from "./modals/UbiikModal";
import FleetpinModal from "./modals/FleetpinModal";
import TutorModal from "./modals/TutorModal";
import ISAModal from "./modals/ISAModal";
import PizzaHutModal from "./modals/PizzaHutModal";
import PakNSaveModal from "./modals/PakNSaveModal";
import SaketModal from "./modals/SaketModal";

import "../components/AboutMe.css";

const AboutMe = () => {
  return (
    <div className="container py-5">

      <section className="mb-5 text-center text-md-start">
        <h1 className="fw-bold mb-3 d-flex justify-content-center">About Me</h1>
        <hr></hr>

        <p className="fs-5 text-muted mb-0">
          I'm a software engineer who enjoys building full-stack applications,
          AI tools, and practical systems that actually get used. I like taking
          real problems, breaking them down, and then shipping solutions that
          are clean, understandable, and maintainable.
        </p>
      </section>

      {/* Experience cards */}
      <section>
        <h2 className="fw-semibold mb-5 text-center text-md-start d-flex justify-content-center">
          What I've been working on
        </h2>
        <p className="text-muted small text-center d-flex justify-content-center">
          👉 Click any card to view more details
        </p>
        <hr></hr>

        {/* --- Engineering & Teaching --- */}
        <h6 className="text-muted text-uppercase small fw-semibold mb-3 mt-4">
          Engineering &amp; Teaching
        </h6>
        <div className="row g-4 align-items-stretch mb-5">

          <div className="col-12 col-md-6 col-lg-4">
            <button
              className="card about-card h-100 rounded-4 border border-2 shadow-md text-start p-0"
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
                <h5 className="card-title fw-semibold mb-1">
                  Software Engineering Intern
                </h5>
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
                  <li>Extending Laravel modules and reusable API workflows.</li>
                  <li>Working across Dockerised SQL data pipelines.</li>
                </ul>
              </div>
            </button>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <button
              className="card about-card h-100 rounded-4 border border-2 shadow-md text-start p-0"
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
                <h5 className="card-title fw-semibold mb-1">
                  Software Engineering Intern
                </h5>
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
                  <li>Fixed UI bugs and improved critical UX paths.</li>
                </ul>
              </div>
            </button>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <button
              className="card about-card h-100 rounded-4 border border-2 shadow-md text-start p-0"
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
                  University of Canterbury · COSC121 &amp; COSC131 · 2025
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
                  <li>Helped run bootcamps and exam prep sessions.</li>
                </ul>
              </div>
            </button>
          </div>
        </div>

        {/* --- Other Experience --- */}
        <h6 className="text-muted text-uppercase small fw-semibold mb-3">
          Other Experience
        </h6>
        <div className="row g-4 align-items-stretch">

          {/* ISA */}
          <div className="col-12 col-md-6 col-lg-3">
            <button
              className="card about-card h-100 rounded-4 border border-2 shadow-md text-start p-0"
              data-bs-toggle="modal"
              data-bs-target="#isaModal"
              style={{ cursor: "pointer", background: "white" }}
            >
              <div
                className="rounded-top-4 d-flex align-items-center justify-content-center"
                style={{ height: "120px", background: "#f4f0ff" }}
              >
                <i className="bi bi-people-fill" style={{ fontSize: "2.5rem", color: "#7c5cbf" }}></i>
              </div>
              <hr className="my-0" />
              <div className="card-body">
                <h5 className="card-title fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>
                  General Executive
                </h5>
                <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>
                  Indian Student Association · UC · 2024
                </p>
                <div className="mb-3">
                  <span className="badge bg-light text-dark me-1">Event Planning</span>
                  <span className="badge bg-light text-dark">Marketing</span>
                </div>
                <ul className="small text-muted ps-3 mb-0">
                  <li>Coordinated cultural events and socials.</li>
                  <li>Handled event marketing and promotion.</li>
                  <li>Collaborated with exec team on logistics.</li>
                </ul>
              </div>
            </button>
          </div>

          {/* Pizza Hut */}
          <div className="col-12 col-md-6 col-lg-3">
            <button
              className="card about-card h-100 rounded-4 border border-2 shadow-md text-start p-0"
              data-bs-toggle="modal"
              data-bs-target="#pizzaHutModal"
              style={{ cursor: "pointer", background: "white" }}
            >
              <div
                className="rounded-top-4 d-flex align-items-center justify-content-center"
                style={{ height: "120px", background: "#fff3f0" }}
              >
                <i className="bi bi-bicycle" style={{ fontSize: "2.5rem", color: "#cc2200" }}></i>
              </div>
              <hr className="my-0" />
              <div className="card-body">
                <h5 className="card-title fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>
                  Delivery Driver
                </h5>
                <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>
                  Pizza Hut · Oct 2023 – Jun 2024
                </p>
                <div className="mb-3">
                  <span className="badge bg-light text-dark me-1">Delivery</span>
                  <span className="badge bg-light text-dark">Customer Service</span>
                </div>
                <ul className="small text-muted ps-3 mb-0">
                  <li>Prepared food in a fast-paced kitchen.</li>
                  <li>Delivered orders accurately and on time.</li>
                  <li>Managed stock and food safety standards.</li>
                </ul>
              </div>
            </button>
          </div>

          {/* PAK'nSAVE */}
          <div className="col-12 col-md-6 col-lg-3">
            <button
              className="card about-card h-100 rounded-4 border border-2 shadow-md text-start p-0"
              data-bs-toggle="modal"
              data-bs-target="#paknsaveModal"
              style={{ cursor: "pointer", background: "white" }}
            >
              <div
                className="rounded-top-4 d-flex align-items-center justify-content-center"
                style={{ height: "120px", background: "#fffbea" }}
              >
                <i className="bi bi-cart-fill" style={{ fontSize: "2.5rem", color: "#b38600" }}></i>
              </div>
              <hr className="my-0" />
              <div className="card-body">
                <h5 className="card-title fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>
                  Grocery Assistant
                </h5>
                <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>
                  PAK'nSAVE · Dec 2020 – Aug 2021
                </p>
                <div className="mb-3">
                  <span className="badge bg-light text-dark me-1">Teamwork</span>
                  <span className="badge bg-light text-dark">Stock Management</span>
                </div>
                <ul className="small text-muted ps-3 mb-0">
                  <li>Rotated and replenished stock.</li>
                  <li>Assisted customers with in-store needs.</li>
                  <li>Kept store clean and well-organised.</li>
                </ul>
              </div>
            </button>
          </div>

          {/* Saket */}
          <div className="col-12 col-md-6 col-lg-3">
            <button
              className="card about-card h-100 rounded-4 border border-2 shadow-md text-start p-0"
              data-bs-toggle="modal"
              data-bs-target="#saketModal"
              style={{ cursor: "pointer", background: "white" }}
            >
              <div
                className="rounded-top-4 d-flex align-items-center justify-content-center"
                style={{ height: "120px", background: "#fff5f0" }}
              >
                <i className="bi bi-cup-hot-fill" style={{ fontSize: "2.5rem", color: "#c45000" }}></i>
              </div>
              <hr className="my-0" />
              <div className="card-body">
                <h5 className="card-title fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>
                  Waiter Staff
                </h5>
                <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>
                  Saket Indian Restaurant · 2017 – 2019
                </p>
                <div className="mb-3">
                  <span className="badge bg-light text-dark me-1">Table Service</span>
                  <span className="badge bg-light text-dark">Delivery</span>
                </div>
                <ul className="small text-muted ps-3 mb-0">
                  <li>Welcomed guests and managed table service.</li>
                  <li>Handled orders, counter, and deliveries.</li>
                  <li>Supported kitchen and food prep duties.</li>
                </ul>
              </div>
            </button>
          </div>

        </div>
      </section>

      {/* How I like to work */}
      <section className="mt-5">
        <h2 className="fw-semibold mb-2 d-flex justify-content-center">General Comments</h2>
        <hr></hr>

        <div className="card about-card border-1 rounded-4 shadow-sm p-4 p-md-5">
          <div className="card-body p-0">
            <div className="row g-4 align-items-start">
              <div className="col-md-7">
                <p className="mb-2 text-muted">
                  I enjoy collaborating with people — walking through ideas on a whiteboard,
                  reviewing code together, and asking questions until everyone is clear on the
                  problem we're solving. I like understanding how a codebase is structured:
                  how modules fit together, where data flows, and which parts of the system own what.
                </p>

                <p className="mb-2 text-muted">
                  Once I understand the context, I break work into smaller, achievable tasks that can
                  be delivered incrementally. I'm very action-focused: see existing solutions, try doing
                  things myself, see how it behaves, and then keep iterating for desired results.
                </p>

                <p className="mb-0 text-muted">
                  I aim to leave things cleaner than I found them — whether that's a feature, a test,
                  or a small internal tool someone else will use later.
                </p>
              </div>

              <div className="col-md-5">
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-start mb-2">
                    <span className="me-2 text-primary"><i className="bi bi-people-fill"></i></span>
                    <span className="small text-muted">
                      Enjoy discussing ideas and collaborating with teammates.
                    </span>
                  </li>
                  <li className="d-flex align-items-start mb-2">
                    <span className="me-2 text-primary"><i className="bi bi-diagram-3"></i></span>
                    <span className="small text-muted">
                      Like understanding architecture, codebase structure, and data flow.
                    </span>
                  </li>
                  <li className="d-flex align-items-start mb-2">
                    <span className="me-2 text-primary"><i className="bi bi-list-check"></i></span>
                    <span className="small text-muted">
                      Break problems into clear, achievable tasks.
                    </span>
                  </li>
                  <li className="d-flex align-items-start mb-2">
                    <span className="me-2 text-primary"><i className="bi bi-arrow-repeat"></i></span>
                    <span className="small text-muted">
                      Take feedback positively and use it to improve the work at hand.
                    </span>
                  </li>
                  <li className="d-flex align-items-start mb-2">
                    <span className="me-2 text-primary"><i className="bi bi-lightning-charge-fill"></i></span>
                    <span className="small text-muted">
                      Take an actionable, experiment-first approach to learning.
                    </span>
                  </li>
                  <li className="d-flex align-items-start">
                    <span className="me-2 text-primary"><i className="bi bi-journal-code"></i></span>
                    <span className="small text-muted">
                      Learn from existing solutions and leave codebases cleaner than before.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <UbiikModal />
      <FleetpinModal />
      <TutorModal />
      <ISAModal />
      <PizzaHutModal />
      <PakNSaveModal />
      <SaketModal />
    </div>
  );
};

export default AboutMe;