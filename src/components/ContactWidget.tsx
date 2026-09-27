import type { FormEvent } from "react";
import { useEffect, useState } from "react";

const FORM_ENDPOINT = "https://portfolio-contact-api-gilt.vercel.app/api/contact";

const ContactWidget = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] =
    useState<"idle" | "sending" | "sent" | "error">("idle");

  // Other parts of the site can open this with: window.dispatchEvent(new Event("open-contact"))
  useEffect(() => {
    const open = () => { setOpen(true); setStatus("idle"); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("open-contact", open);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("open-contact", open); window.removeEventListener("keydown", esc); };
  }, []);

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
      <style>{`
        .cw-fab {
          position: fixed; right: 20px; bottom: 20px; z-index: 1050;
          display: inline-flex; align-items: center; gap: 10px;
          height: 52px; padding: 0 20px 0 16px; border-radius: 999px; border: 0;
          font-family: var(--font-mono); font-size: 0.78rem; font-weight: 500; letter-spacing: 0.04em; color: #fff;
          background: linear-gradient(135deg, var(--accent), var(--purple));
          box-shadow: 0 12px 30px rgba(124,143,255,0.4);
          transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease;
        }
        .cw-fab:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 16px 40px rgba(124,143,255,0.55); }
        .cw-fab i { font-size: 1.1rem; }
        @media (max-width: 575px) { .cw-fab span { display: none; } .cw-fab { width: 52px; padding: 0; justify-content: center; } }
        .cw-overlay {
          position: fixed; inset: 0; z-index: 1060; display: flex; align-items: center; justify-content: center;
          background: rgba(5,6,10,0.7); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          animation: cw-fade .25s ease both; padding: 16px;
        }
        .cw-panel {
          width: 100%; max-width: 480px; border-radius: 22px; padding: 28px;
          background: linear-gradient(160deg, #121524, #0b0d16);
          border: 1px solid var(--accent-border);
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(124,143,255,0.12);
          color: var(--text-primary);
          animation: cw-pop .35s cubic-bezier(.34,1.56,.64,1) both;
        }
        .cw-panel h5 { font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; margin: 0; }
        .cw-panel p.cw-sub { color: var(--text-secondary); font-size: 0.88rem; margin: 6px 0 20px; }
        .cw-panel label { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; display: block; }
        .cw-panel input, .cw-panel textarea {
          width: 100%; padding: 11px 14px; border-radius: 12px; margin-bottom: 14px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(124,143,255,0.18);
          color: var(--text-primary); font-size: 0.92rem; outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .cw-panel input::placeholder, .cw-panel textarea::placeholder { color: var(--text-dim); }
        .cw-panel input:focus, .cw-panel textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,143,255,0.18); }
        .cw-actions { display: flex; justify-content: space-between; gap: 10px; margin-top: 6px; }
        .cw-btn { padding: 10px 20px; border-radius: 12px; font-family: var(--font-mono); font-size: 0.8rem; border: 1px solid var(--accent-border); background: transparent; color: var(--text-secondary); }
        .cw-btn:hover { color: #fff; border-color: rgba(124,143,255,0.5); }
        .cw-btn--go { border: 0; color: #fff; background: linear-gradient(135deg, var(--accent), var(--purple)); box-shadow: 0 8px 22px rgba(124,143,255,0.35); }
        .cw-btn--go:disabled { opacity: .6; }
        .cw-close { background: transparent; border: 1px solid rgba(124,143,255,0.2); border-radius: 10px; width: 34px; height: 34px; padding: 0; color: var(--text-secondary); }
        .cw-close:hover { color: #fff; border-color: rgba(124,143,255,0.5); }
        .cw-msg { margin-top: 14px; padding: 10px 14px; border-radius: 12px; font-size: 0.85rem; }
        .cw-msg--ok { background: rgba(92,200,140,0.1); border: 1px solid rgba(92,200,140,0.35); color: #a6f0c6; }
        .cw-msg--err { background: rgba(224,68,62,0.1); border: 1px solid rgba(224,68,62,0.4); color: #ffb3ad; }
        @keyframes cw-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cw-pop { from { opacity: 0; transform: translateY(20px) scale(.95); } to { opacity: 1; transform: none; } }
      `}</style>

      <button
        type="button"
        className="cw-fab"
        aria-label="Send me a message"
        onClick={() => {
          setOpen(true);
          setStatus("idle");
        }}
      >
        <i className="bi bi-chat-dots-fill" /><span>Say hi</span>
      </button>

      {open && (
        <div className="cw-overlay" onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="cw-panel" role="dialog" aria-modal="true" aria-labelledby="cw-title">
            <div className="d-flex justify-content-between align-items-start">
              <h5 id="cw-title">Let's talk.</h5>
              <button type="button" className="cw-close" aria-label="Close" onClick={() => setOpen(false)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <p className="cw-sub">Tell me who you are and what you'd like to talk about. I'll reply by email.</p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="cw-name">Your name</label>
              <input id="cw-name" name="name" type="text" required placeholder="Jane Doe" />
              <label htmlFor="cw-email">Your email</label>
              <input id="cw-email" name="email" type="email" required placeholder="you@example.com" />
              <label htmlFor="cw-message">Message</label>
              <textarea id="cw-message" name="message" rows={4} required placeholder="What would you like to chat about?" />

              <div className="cw-actions">
                <button type="button" className="cw-btn" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="cw-btn cw-btn--go" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : <>Send <i className="bi bi-send ms-1" /></>}
                </button>
              </div>

              {status === "sent" && (
                <div className="cw-msg cw-msg--ok">Thanks for reaching out! I'll get back to you as soon as I can.</div>
              )}
              {status === "error" && (
                <div className="cw-msg cw-msg--err">Something went wrong. Please try again or email me directly.</div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactWidget;
