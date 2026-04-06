import { ModalCloseButton } from "../../hooks/useModalClose";

const ISAModal = () => {
  return (
    <div
      className="modal fade"
      id="isaModal"
      tabIndex={-1}
      aria-labelledby="isaModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold" id="isaModalLabel">
                General Executive – Indian Student Association
              </h5>
              <p className="text-muted small mb-0">
                University of Canterbury · Feb 2024 – Nov 2024 · 10 months
              </p>
            </div>
            <ModalCloseButton modalId="isaModal" />
          </div>

          <div
            className="modal-body pt-3"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {/* Summary highlight */}
            <div className="mb-4">
              <div className="p-3 rounded-4 bg-light border">
                <p className="text-muted mb-0 small">
                  Served as a General Executive for the{" "}
                  <strong>Indian Student Association</strong> at the University
                  of Canterbury, contributing to a vibrant student community
                  through event planning, marketing, and on-the-ground
                  coordination across cultural events and socials.
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
                        <i className="bi bi-calendar-event-fill text-primary"></i>
                      </span>
                      What I did
                    </h6>
                    <ul className="small text-muted ps-3 mb-0">
                      <li className="mb-1">
                        Helped plan and coordinate <strong>cultural events</strong> and
                        social gatherings for the student community.
                      </li>
                      <li className="mb-1">
                        Assisted with <strong>event marketing</strong> — promoting
                        events through social media and student channels to drive
                        attendance.
                      </li>
                      <li className="mb-1">
                        Collaborated with other executives to manage logistics,
                        timelines, and on-the-day operations.
                      </li>
                      <li className="mb-1">
                        Supported the association's mission to build community and
                        connection among Indian students at UC.
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
                        <i className="bi bi-people-fill text-primary"></i>
                      </span>
                      What I took away
                    </h6>
                    <ul className="small text-muted ps-3 mb-3">
                      <li className="mb-1">
                        Gained hands-on experience organising events from scratch,
                        balancing multiple moving parts under time pressure.
                      </li>
                      <li className="mb-1">
                        Developed confidence communicating and coordinating within
                        a volunteer team with shared goals.
                      </li>
                      <li className="mb-1">
                        Learned how to market events effectively to a student
                        audience and grow engagement over time.
                      </li>
                    </ul>

                    <h6 className="fw-semibold small text-uppercase text-muted mb-2">
                      Skills
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-light text-dark border">Event Planning</span>
                      <span className="badge bg-light text-dark border">Event Marketing</span>
                      <span className="badge bg-light text-dark border">Teamwork</span>
                      <span className="badge bg-light text-dark border">Communication</span>
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

export default ISAModal;