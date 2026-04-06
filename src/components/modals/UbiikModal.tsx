import ubiikImg from "../../assets/ubiik.png";
import { ModalCloseButton } from "../../hooks/useModalClose";

const UbiikModal = () => {
  return (
    <div
      className="modal fade"
      id="ubiikModal"
      tabIndex={-1}
      aria-labelledby="ubiikModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content rounded-4 shadow-lg">

          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold" id="ubiikModalLabel">
                Ubiik Mimomax – Software Engineering Intern
              </h5>
              <p className="text-muted small mb-0">
                Industrial IoT · Internal tooling · 2024 – 2025
              </p>
            </div>
            <ModalCloseButton modalId="ubiikModal" />
          </div>

          <div
            className="modal-body pt-3"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {/* Hero image */}
            <div className="text-center mb-4">
              <img
                src={ubiikImg}
                alt="Ubiik Mimomax"
                className="img-fluid rounded-4 shadow-sm border"
                style={{ maxHeight: "260px", objectFit: "contain" }}
              />
            </div>

            {/* Summary */}
            <div className="mb-4">
              <div className="p-3 rounded-4 bg-light border">
                <p className="text-muted mb-0 small">
                  I worked on Ubiik's <strong>internal Konfig tool</strong>, which
                  manages purchase orders and configures device requirements
                  across product platforms. My work involved importing and
                  reconciling hardware data (including MAC addresses and serial
                  numbers), modernising the UI, and improving reliability,
                  security, and operational efficiency.
                </p>
              </div>
            </div>

            {/* Two-column detail panels */}
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="card border-0 bg-light rounded-4 h-100">
                  <div className="card-body p-3 p-md-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center">
                      <span className="me-2"><i className="bi bi-tools text-primary"></i></span>
                      What I worked on
                    </h6>
                    <ul className="small text-muted ps-3 mb-0">
                      <li className="mb-1">Developed UI enhancements for the Konfig application, including PO search by serial number, relaxed PO format restrictions, and a QA tab for quality-assurance fields.</li>
                      <li className="mb-1">Implemented logic to <strong>import and parse Tait Communications data</strong>, mapping MAC addresses, serial numbers, and device metadata to the correct <strong>purchase orders</strong>.</li>
                      <li className="mb-1">Ensured imported data integrity by handling partial matches, duplicates, and missing fields, and supported CSV exports with additional QA metadata.</li>
                      <li className="mb-1">Enhanced platform management by enabling default templates and merging redundant entries to prevent orphaned references.</li>
                      <li className="mb-1">Improved the UI by upgrading from <strong>Bootstrap 3 to 5</strong>, modernising layout, spacing, and form controls.</li>
                      <li className="mb-1">Refactored legacy UI code, removed deprecated classes, and simplified component structure for maintainability.</li>
                      <li className="mb-1">Fixed production bugs including broken PO deletions and raw config import issues.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card border-0 bg-light rounded-4 h-100 shadow-sm">
                  <div className="card-body p-3 p-md-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center">
                      <span className="me-2"><i className="bi bi-check2-circle text-primary"></i></span>
                      Impact & how I worked
                    </h6>
                    <ul className="small text-muted ps-3 mb-3">
                      <li className="mb-1">Added and maintained <strong>unit tests</strong> for new features such as raw config imports, deletions, and PO handling.</li>
                      <li className="mb-1">Collaborated across multiple sprints, balancing feature work, bug fixes, and database clean-up tasks.</li>
                      <li className="mb-1">Contributed to the release of <strong>Konfig 6.0</strong>, shipping resolved versions without regressions.</li>
                      <li className="mb-1">Worked in a <strong>Docker-based environment</strong>, following established patterns for safe deployment.</li>
                      <li className="mb-1">Improved application security by hiding sensitive listings for unauthorised users.</li>
                    </ul>
                    <h6 className="fw-semibold small text-uppercase text-muted mb-2">Tech used</h6>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-light text-dark border">Internal Web Tools</span>
                      <span className="badge bg-light text-dark border">SQLite</span>
                      <span className="badge bg-light text-dark border">CSV Import/Export</span>
                      <span className="badge bg-light text-dark border">Docker</span>
                      <span className="badge bg-light text-dark border">Authentication/RBAC</span>
                      <span className="badge bg-light text-dark border">Unit Testing</span>
                      <span className="badge bg-light text-dark border">Bootstrap 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="mt-4 d-flex flex-wrap gap-2 justify-content-center">
              <a href="https://www.linkedin.com/company/ubiikmimomax" target="_blank" rel="noreferrer" className="btn btn-primary">
                <i className="bi bi-linkedin me-2"></i>View on LinkedIn
              </a>
              <a href="https://ubiikmimomax.com" target="_blank" rel="noreferrer" className="btn btn-outline-secondary">
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