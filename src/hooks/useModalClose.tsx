export function ModalCloseButton({ modalId }: { modalId: string }) {
  const handleClose = () => {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.classList.remove("show");
    el.style.display = "none";
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    document.querySelector(".modal-backdrop")?.remove();
  };

  return (
    <button
      type="button"
      onClick={handleClose}
      aria-label="Close"
      style={{
        position: "absolute", top: "1rem", right: "1rem", zIndex: 10,
        background: "transparent",
        border: "1px solid rgba(124,143,255,0.2)",
        borderRadius: "8px",
        width: "32px", height: "32px",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        color: "var(--text-secondary, #8892aa)",
        fontSize: "1rem",
        transition: "border-color 0.18s ease, color 0.18s ease",
      }}
      onMouseEnter={e => {
        const b = e.currentTarget as HTMLButtonElement;
        b.style.borderColor = "rgba(124,143,255,0.5)";
        b.style.color = "var(--text-primary, #e8eaf2)";
      }}
      onMouseLeave={e => {
        const b = e.currentTarget as HTMLButtonElement;
        b.style.borderColor = "rgba(124,143,255,0.2)";
        b.style.color = "var(--text-secondary, #8892aa)";
      }}
    >
      <i className="bi bi-x-lg" />
    </button>
  );
}