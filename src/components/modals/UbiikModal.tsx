import ubiikImg from "../../assets/ubiik.png";

const UbiikModal = () => {
  return (
    <div
      className="modal fade"
      id="ubiikModal"
      tabIndex={-1}
      aria-labelledby="ubiikModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="ubiikModalLabel">Ubiik Mimomax</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            <div className="text-center mb-3">
              <img
                src={ubiikImg}
                alt="Ubiik Mimomax"
                className="img-fluid rounded-4 shadow-sm border"
                style={{ maxHeight: "320px", objectFit: "contain" }}
              />
            </div>

            <p className="text-muted mb-3">
              I work at Ubiik Mimomax as a Software Engineering Intern, modernising UI, 
              building tools around SQLite configuration, and working in a Docker-based environment.
            </p>
            
            <div className="mt-4 d-flex flex-wrap gap-2 justify-content-center">
              <a
              href="https://www.linkedin.com/company/ubiikmimomax"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary me-2"
              >
              <i className="bi bi-linkedin me-2"></i>
              View on LinkedIn
              </a>

              <a
                href="https://ubiikmimomax.com"
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

export default UbiikModal;
