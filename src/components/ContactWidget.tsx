import type { FormEvent } from "react";
import { useState } from "react";

const FORM_ENDPOINT = "https://portfolio-contact-api-gilt.vercel.app/api/contact";

const ContactWidget = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] =
    useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const formData = {
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        message: String(fd.get("message") ?? ""),
    };
    console.log(formData);
    try {
        const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        });

        if (res.ok) {
        setStatus("sent");
        form.reset();
        } else {
        setStatus("error");
        }
    } catch (err) {
        console.error(err);
        setStatus("error");
    }
    };


  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-3 shadow"
        style={{ width: "56px", height: "56px", zIndex: 1050 }}
        onClick={() => {
          setOpen(true);
          setStatus("idle");
        }}
      >
        <i className="bi bi-chat-dots-fill fs-4"></i>
      </button>

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }}
        >
          <div className="bg-light rounded shadow p-4" style={{ width: "90%", maxWidth: "480px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Email me</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              ></button>
            </div>

            <p className="text-muted mb-3">
              Tell me who you are and what you’d like to talk about. I’ll reply by email.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Your name</label>
                <input
                  name="name"
                  className="form-control"
                  type="text"
                  required
                  placeholder="Jane Doe"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Your email</label>
                <input
                  name="email"
                  className="form-control"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows={4}
                  required
                  placeholder="What would you like to chat about?"
                ></textarea>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send"}
                </button>
              </div>

              {status === "sent" && (
                <div className="alert alert-success mt-3 mb-0 py-2">
                  Message sent. Thanks!
                </div>
              )}
              {status === "error" && (
                <div className="alert alert-danger mt-3 mb-0 py-2">
                  Something went wrong. Please try again or email me directly.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactWidget;
