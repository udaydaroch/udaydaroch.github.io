import tutorImg from "../../assets/tutor.png";

const TutorModal = () => {
  return (
    <div
      className="modal fade"
      id="tutorModal"
      tabIndex={-1}
      aria-labelledby="tutorModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content rounded-4 shadow-lg">
          
          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold" id="tutorModalLabel">
                Programming Tutor – University of Canterbury
              </h5>
              <p className="text-muted small mb-0">
                COSC121 · COSC131 · CSSE Department · 2025
              </p>
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          {/* Scrollable body */}
          <div
            className="modal-body pt-3"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {/* Image */}
            <div className="text-center mb-4">
              <img
                src={tutorImg}
                alt="Tutoring"
                className="img-fluid rounded-4 shadow-sm"
                style={{ maxHeight: "260px", objectFit: "contain" }}
              />
            </div>

            {/* Summary panel */}
            <div className="mb-4">
              <div className="p-3 p-md-3 rounded-4 bg-light border">
                <p className="text-muted mb-0 small">
                  As a programming tutor, I taught first-year students core 
                  programming and problem-solving skills, ran labs and help 
                  sessions, and supported teaching across multiple CSSE courses.
                </p>
              </div>
            </div>

            {/* Two detail panels */}
            <div className="row g-3">
              
              {/* Teaching & responsibilities */}
              <div className="col-12 col-md-6">
                <div className="card border-0 bg-light rounded-4 h-100">
                  <div className="card-body p-3 p-md-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center">
                      <span className="me-2">
                        <i className="bi bi-mortarboard-fill text-primary"></i>
                      </span>
                      Teaching & Responsibilities
                    </h6>

                    <ul className="small text-muted ps-3 mb-0">
                      <li className="mb-1">
                        Conducted weekly <strong>lab sessions</strong> (2–3 per week) 
                        for COSC121 & COSC131 focusing on Python fundamentals.
                      </li>
                      <li className="mb-1">
                        Ran <strong>help sessions</strong> where I broke down concepts 
                        step-by-step—loops, functions, recursion, problem decomposition.
                      </li>
                      <li className="mb-1">
                        Worked in <strong>one-on-one sessions</strong> to help students debug 
                        code, understand errors, and build confidence.
                      </li>
                      <li className="mb-1">
                        Invigilated <strong>midterms and final exams</strong> for multiple CSSE 
                        courses, including 100–400 level papers.
                      </li>
                      <li className="mb-1">
                        Supported <strong>tutorials and bootcamps</strong> before major 
                        assessments and exams.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Impact & engagement */}
              <div className="col-12 col-md-6">
                <div className="card border-0 bg-light rounded-4 shadow-sm h-100">
                  <div className="card-body p-3 p-md-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center">
                      <span className="me-2">
                        <i className="bi bi-people-fill text-primary"></i>
                      </span>
                      Impact & Engagement
                    </h6>

                    <ul className="small text-muted ps-3 mb-3">
                      <li className="mb-1">
                        Helped students understand programming concepts by 
                        breaking them down into simple, logical steps.
                      </li>
                      <li className="mb-1">
                        Collaborated with lecturers & tutors in weekly 
                        <strong>teaching meetings</strong> to improve student engagement 
                        and teaching quality.
                      </li>
                      <li className="mb-1">
                        Provided constructive feedback to students and supported 
                        them throughout labs, projects, and exam preparation.
                      </li>
                    </ul>

                    <h6 className="fw-semibold small text-uppercase text-muted mb-2">
                      Skills developed
                    </h6>

                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-light text-dark border">
                        Python
                      </span>
                      <span className="badge bg-light text-dark border">
                        Teaching
                      </span>
                      <span className="badge bg-light text-dark border">
                        Communication
                      </span>
                      <span className="badge bg-light text-dark border">
                        Problem Solving
                      </span>
                      <span className="badge bg-light text-dark border">
                        Debugging
                      </span>
                      <span className="badge bg-light text-dark border">
                        Student Support
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Links */}
            <div className="mt-4 d-flex flex-wrap gap-2">
              <a
                href="https://www.linkedin.com/showcase/uccsse/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <i className="bi bi-linkedin me-2"></i>
                View on LinkedIn
              </a>

              <a
                href="https://www.canterbury.ac.nz"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-secondary"
              >
                🌐 Visit Website
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorModal;
