import { ModalCloseButton } from "../../hooks/useModalClose";

const PizzaHutModal = () => {
  return (
    <div
      className="modal fade"
      id="pizzaHutModal"
      tabIndex={-1}
      aria-labelledby="pizzaHutModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold" id="pizzaHutModalLabel">
                Delivery Driver
              </h5>
              <p className="text-muted small mb-0">
                Pizza Hut · Oct 2023 – Jun 2024 · 9 months · Christchurch, NZ
              </p>
            </div>
            <ModalCloseButton modalId="pizzaHutModal" />
          </div>

          <div
            className="modal-body pt-3"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {/* Summary highlight */}
            <div className="mb-4">
              <div className="p-3 rounded-4 bg-light border">
                <p className="text-muted mb-0 small">
                  Worked part-time at <strong>Pizza Hut</strong> in a fast-paced
                  kitchen and delivery environment, handling everything from food
                  preparation to in-store customer service and timely delivery
                  runs — all while keeping to food safety and quality standards.
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
                        <i className="bi bi-bag-fill text-primary"></i>
                      </span>
                      What I did
                    </h6>
                    <ul className="small text-muted ps-3 mb-0">
                      <li className="mb-1">
                        Prepared <strong>pizzas and food products</strong> in a
                        high-volume kitchen environment, maintaining speed and
                        consistency during busy periods.
                      </li>
                      <li className="mb-1">
                        Delivered a high standard of <strong>customer service</strong>,
                        handling in-store orders and resolving queries on the spot.
                      </li>
                      <li className="mb-1">
                        Carried out <strong>delivery driving</strong>, ensuring
                        orders reached customers accurately and on time.
                      </li>
                      <li className="mb-1">
                        Managed <strong>stock levels</strong> — receiving, rotating,
                        and correctly storing inventory to minimise waste.
                      </li>
                      <li className="mb-1">
                        Maintained <strong>cleanliness and food safety standards</strong>{" "}
                        across both kitchen and front-of-house areas.
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
                        Built the ability to stay calm, focused, and efficient
                        under pressure during peak service hours.
                      </li>
                      <li className="mb-1">
                        Strengthened time management and multitasking skills
                        across kitchen, service, and delivery tasks simultaneously.
                      </li>
                      <li className="mb-1">
                        Developed reliability and accountability — customers and
                        teammates depended on me to get it right every time.
                      </li>
                    </ul>

                    <h6 className="fw-semibold small text-uppercase text-muted mb-2">
                      Skills
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-light text-dark border">Food Delivery</span>
                      <span className="badge bg-light text-dark border">Customer Service</span>
                      <span className="badge bg-light text-dark border">Stock Management</span>
                      <span className="badge bg-light text-dark border">Food Safety</span>
                      <span className="badge bg-light text-dark border">Time Management</span>
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

export default PizzaHutModal;