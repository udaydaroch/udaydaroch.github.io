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
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="tutorModalLabel">
              Programming Tutor · University of Canterbury
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            <div className="text-center mb-3">
              <img
                src={tutorImg}
                alt="Tutoring"
                className="img-fluid rounded-4 shadow-sm"
                style={{ maxHeight: "320px", objectFit: "contain" }}
              />
            </div>

            <p className="text-muted mb-3">
              As a programming tutor, I helped first-year students with Python, 
              problem solving, and core software engineering fundamentals.
            </p>

            <a
              href="https://www.linkedin.com/showcase/uccsse/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary me-2"
            >
              <i className="bi bi-linkedin me-2"></i>
              View CSSE on LinkedIn
            </a>

            <a
              href="https://www.canterbury.ac.nz"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-secondary"
            >
              🌐 Visit UC Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorModal;
