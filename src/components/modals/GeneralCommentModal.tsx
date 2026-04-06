const GeneralComments = () => {
  return (
    <section className="mt-5">
      <h2 className="fw-semibold mb-2 d-flex justify-content-center">General Comments</h2>
      <hr />

      <div className="card about-card border-1 rounded-4 shadow-sm p-4 p-md-5">
        <div className="card-body p-0">
          <div className="row g-4 align-items-start">
            <div className="col-md-7">
              <p className="mb-2 text-muted">
                Across all my experience — whether writing code, tutoring students, or working
                a busy restaurant shift — the common thread has been caring about the people
                I'm serving. In engineering that means building things that are clean and
                actually useful. On the floor it meant making sure every customer left satisfied.
                Either way, I take pride in doing the job properly.
              </p>

              <p className="mb-2 text-muted">
                I enjoy collaborating with people — whether that's walking through a tricky
                bug with a teammate, helping a student understand a concept they've been stuck
                on, or coordinating with a kitchen team during a dinner rush. I'm comfortable
                in fast-paced environments and pick up new processes quickly.
              </p>

              <p className="mb-0 text-muted">
                In technical work I break problems down into smaller steps and iterate until
                things work well. In any role I aim to leave things in better shape than I
                found them — cleaner code, a tidier shelf, a smoother handoff.
              </p>
            </div>

            <div className="col-md-5">
              <ul className="list-unstyled mb-0">
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-primary"><i className="bi bi-person-heart"></i></span>
                  <span className="small text-muted">
                    Customer-focused in every role — engineering, service, or teaching.
                  </span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-primary"><i className="bi bi-people-fill"></i></span>
                  <span className="small text-muted">
                    Collaborative by default — I work well in teams and enjoy open communication.
                  </span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-primary"><i className="bi bi-lightning-charge-fill"></i></span>
                  <span className="small text-muted">
                    Adaptable and quick to pick up new environments, tools, and processes.
                  </span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-primary"><i className="bi bi-list-check"></i></span>
                  <span className="small text-muted">
                    Break work into clear, manageable steps and follow through reliably.
                  </span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <span className="me-2 text-primary"><i className="bi bi-arrow-repeat"></i></span>
                  <span className="small text-muted">
                    Take feedback positively and use it to improve the work at hand.
                  </span>
                </li>
                <li className="d-flex align-items-start">
                  <span className="me-2 text-primary"><i className="bi bi-stars"></i></span>
                  <span className="small text-muted">
                    Aim to leave things better than I found them — in any role.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralComments;