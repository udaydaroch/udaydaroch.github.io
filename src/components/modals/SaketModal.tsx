const SaketModal = () => {
  return (
    <div
      className="modal fade"
      id="saketModal"
      tabIndex={-1}
      aria-labelledby="saketModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold" id="saketModalLabel">
                Waiter Staff
              </h5>
              <p className="text-muted small mb-0">
                Saket Indian Restaurant · Feb 2017 – Nov 2019 · 2 yrs 10 months · Edgeware Road, Christchurch
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
                  Worked part-time at <strong>Saket Indian Restaurant</strong> for
                  nearly three years, providing attentive front-of-house service
                  while also supporting kitchen operations, counter service, and
                  delivery coordination in a busy restaurant setting.
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
                        <i className="bi bi-cup-hot-fill text-primary"></i>
                      </span>
                      What I did
                    </h6>
                    <ul className="small text-muted ps-3 mb-0">
                      <li className="mb-1">
                        <strong>Welcomed and seated guests</strong>, providing
                        attentive table service throughout their dining experience.
                      </li>
                      <li className="mb-1">
                        Took accurate <strong>food and beverage orders</strong> and
                        communicated them effectively to kitchen staff.
                      </li>
                      <li className="mb-1">
                        Assisted with <strong>kitchen hand duties</strong> including
                        food preparation support and maintaining a clean workspace.
                      </li>
                      <li className="mb-1">
                        Managed <strong>counter service</strong>, handling transactions
                        and ensuring efficient order flow during busy periods.
                      </li>
                      <li className="mb-1">
                        Coordinated and processed <strong>delivery orders</strong>,
                        ensuring timely and accurate dispatch to customers.
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
                        <i className="bi bi-graph-up-arrow text-primary"></i>
                      </span>
                      What I took away
                    </h6>
                    <ul className="small text-muted ps-3 mb-3">
                      <li className="mb-1">
                        Built strong customer-facing communication skills over
                        nearly three years of front-of-house service.
                      </li>
                      <li className="mb-1">
                        Learned to manage multiple responsibilities simultaneously —
                        tables, orders, deliveries, and kitchen support — without
                        dropping the ball.
                      </li>
                      <li className="mb-1">
                        Developed a strong work ethic and adaptability, stepping
                        into different roles as the restaurant needed.
                      </li>
                    </ul>

                    <h6 className="fw-semibold small text-uppercase text-muted mb-2">
                      Skills
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-light text-dark border">Customer Service</span>
                      <span className="badge bg-light text-dark border">Food Delivery</span>
                      <span className="badge bg-light text-dark border">Table Service</span>
                      <span className="badge bg-light text-dark border">Multitasking</span>
                      <span className="badge bg-light text-dark border">Kitchen Support</span>
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

export default SaketModal;