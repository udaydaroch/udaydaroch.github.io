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
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold" id="fleetpinModalLabel">
                Fleetpin – Software Engineering Intern
              </h5>
              <p className="text-muted small mb-0">
                GPS tracking platform · 2024 – 2025 · Christchurch, NZ
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div
            className="modal-body pt-3"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {/* Hero image */}
            <div className="text-center mb-4">
              <img
                src={fleetpinImg}
                alt="Fleetpin"
                className="img-fluid rounded-4 shadow-sm border"
                style={{ maxHeight: "260px", objectFit: "contain" }}
              />
            </div>

            {/* Summary highlight */}
            <div className="mb-4">
              <div className="p-3 p-md-3 rounded-4 bg-light border">
                <p className="text-muted mb-0 small">
                  Fleetpin is a GPS tracking platform used by fleets across New
                  Zealand and Australia. I worked across the{" "}
                  <strong>Vue.js front end</strong>,{" "}
                  <strong>service workers</strong>, and{" "}
                  <strong>backend integrations</strong> to make core workflows
                  faster, more robust, and usable even when drivers are offline.
                </p>
              </div>
            </div>

            {/* Two-column detail panels on desktop */}
            <div className="row g-3">
              {/* Panel: What I worked on */}
              <div className="col-12 col-md-6">
                <div className="card border-0 bg-light rounded-4 h-100">
                  <div className="card-body p-3 p-md-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center">
                      <span className="me-2">
                        <i className="bi bi-kanban-fill text-primary"></i>
                      </span>
                      What I worked on
                    </h6>
                    <ul className="small text-muted ps-3 mb-0">
                      <li className="mb-1">
                        Built and refined <strong>Vue.js</strong> components for
                        key GPS tracking and asset management workflows.
                      </li>
                      <li className="mb-1">
                        Implemented and debugged{" "}
                        <strong>service workers for offline mode</strong>,
                        allowing users to keep working with cached data when the
                        network drops.
                      </li>
                      <li className="mb-1">
                        Cleaned up and consolidated{" "}
                        <strong>GraphQL queries</strong> to reduce
                        over-fetching, simplify responses, and improve
                        readability.
                      </li>
                      <li className="mb-1">
                        Helped integrate the{" "}
                        <strong>Fuel Saver API</strong> so customers could see
                        fuel-efficiency insights alongside tracking data.
                      </li>
                      <li className="mb-1">
                        Fixed a range of <strong>UI and logic bugs</strong>{" "}
                        taken from real customer accounts, focusing on
                        consistency and edge cases.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Panel: Impact & ways of working */}
              <div className="col-12 col-md-6">
                <div className="card border-0 bg-light rounded-4 h-100 shadow-sm">
                  <div className="card-body p-3 p-md-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center">
                      <span className="me-2">
                        <i className="bi bi-graph-up-arrow text-primary"></i>
                      </span>
                      Impact & how I worked
                    </h6>
                    <ul className="small text-muted ps-3 mb-3">
                      <li className="mb-1">
                        Collaborated with senior engineers to follow existing
                        patterns and ship changes via small, reviewable PRs.
                      </li>
                      <li className="mb-1">
                        Added quality-of-life improvements: clearer loading and
                        error states, better empty states, and fewer surprise
                        behaviours for users.
                      </li>
                      <li className="mb-1">
                        Left code cleaner than I found it by simplifying
                        components, removing dead code, and improving naming and
                        structure.
                      </li>
                    </ul>

                    <h6 className="fw-semibold small text-uppercase text-muted mb-2">
                      Tech used
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-light text-dark border">
                        Vue.js
                      </span>
                      <span className="badge bg-light text-dark border">
                        Service Workers / Offline
                      </span>
                      <span className="badge bg-light text-dark border">
                        GraphQL
                      </span>
                      <span className="badge bg-light text-dark border">
                        REST APIs
                      </span>
                      <span className="badge bg-light text-dark border">
                        SQL
                      </span>
                      <span className="badge bg-light text-dark border">
                        Fuel Saver API
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="mt-4 d-flex flex-wrap gap-2">
              <a
                href="https://www.linkedin.com/company/fleetpin"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
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
    </div>
  );
};

export default FleetpinModal;
