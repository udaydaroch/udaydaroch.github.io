const PakNSaveModal = () => {
  return (
    <div
      className="modal fade"
      id="paknsaveModal"
      tabIndex={-1}
      aria-labelledby="paknsaveModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold" id="paknsaveModalLabel">
                Grocery Assistant
              </h5>
              <p className="text-muted small mb-0">
                PAK'nSAVE · Dec 2020 – Aug 2021 · 9 months · Papanui Road, Christchurch
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
            {/* Summary highlight */}
            <div className="mb-4">
              <div className="p-3 rounded-4 bg-light border">
                <p className="text-muted mb-0 small">
                  Worked part-time at <strong>PAK'nSAVE Papanui</strong> as a
                  Grocery Assistant, supporting smooth day-to-day store operations
                  through stock management, customer assistance, and maintaining a
                  clean and well-organised environment during busy trading periods.
                </p>
              </div>
            </div>

            {/* Two-column detail panels */}
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="card border-0 bg-light rounded-4 h-100">
                  <div className="card-body p-3 p-md-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center">
                      <span className="me-2">
                        <i className="bi bi-shop text-primary"></i>
                      </span>
                      What I did
                    </h6>
                    <ul className="small text-muted ps-3 mb-0">
                      <li className="mb-1">
                        <strong>Rotated and replenished stock</strong> to ensure
                        product freshness and consistent shelf availability.
                      </li>
                      <li className="mb-1">
                        Maintained a <strong>clean, safe, and well-organised</strong>{" "}
                        store environment throughout shifts.
                      </li>
                      <li className="mb-1">
                        Assisted customers with queries, locating products, and
                        general in-store needs — always with a friendly approach.
                      </li>
                      <li className="mb-1">
                        Carried out routine <strong>operational tasks</strong> to
                        support smooth day-to-day store functioning.
                      </li>
                      <li className="mb-1">
                        Collaborated with teammates to meet store standards during
                        high-traffic trading periods.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card border-0 bg-light rounded-4 h-100 shadow-sm">
                  <div className="card-body p-3 p-md-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center">
                      <span className="me-2">
                        <i className="bi bi-stars text-primary"></i>
                      </span>
                      What I took away
                    </h6>
                    <ul className="small text-muted ps-3 mb-3">
                      <li className="mb-1">
                        Developed strong teamwork habits — stepping up, communicating
                        clearly, and supporting colleagues during rush periods.
                      </li>
                      <li className="mb-1">
                        Gained practical experience with stock management, inventory
                        rotation, and retail operations.
                      </li>
                      <li className="mb-1">
                        Built a foundation of reliability and customer-facing
                        confidence that carries across roles.
                      </li>
                    </ul>

                    <h6 className="fw-semibold small text-uppercase text-muted mb-2">
                      Skills
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-light text-dark border">Teamwork</span>
                      <span className="badge bg-light text-dark border">Stock Management</span>
                      <span className="badge bg-light text-dark border">Customer Service</span>
                      <span className="badge bg-light text-dark border">Retail Operations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PakNSaveModal;