import fleetpinImg from "../../assets/fleetpin.png";

const FleetpinModal = () => {
  return (
    <div
      className="modal fade"
      id="fleetpinModal"
      tabIndex={-1}
      aria-labelledby="fleetpinModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="fleetpinModalLabel">Fleetpin</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            <div className="text-center mb-3">
              <img
                src={fleetpinImg}
                alt="Fleetpin"
                className="img-fluid rounded-4 shadow-sm"
                style={{ maxHeight: "320px", objectFit: "contain" }}
              />
            </div>

            <p className="text-muted mb-3">
              At Fleetpin, I worked on performance improvements, API integrations, 
              and offline functionality for GPS tracking systems.
            </p>

            <a
              href="https://www.linkedin.com/company/fleetpin"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary me-2"
            >
              <i className="bi bi-linkedin me-2"></i>
              View on LinkedIn
            </a>

            <a
              href="https://fleetpin.co.nz"
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
  );
};

export default FleetpinModal;
