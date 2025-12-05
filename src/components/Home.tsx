import "./Home.css";

const Home = () => {
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >

        <div className="typing hero-name mt-4">Uday Daroch</div>

      <p className="lead fade-up fade-delay mt-3 hero-subtitle">
        Software Engineer • Full Stack • AI • Security
      </p>

      <div className="d-flex gap-5 mt-4 fade-up fade-delay">
            <a
                href="https://linkedin.com/in/uday-daroch-152a51280"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-3 social-link"
            >
                <i className="bi bi-linkedin" style={{ fontSize: "2.4rem", color: "#0A66C2" }}></i>
                <span className="fw-bold" style={{ fontSize: "1.4rem" }}>LinkedIn</span>
            </a>

            <a
                href="https://github.com/udaydaroch"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-3 social-link"
            >
                <i className="bi bi-github" style={{ fontSize: "2.4rem" }}></i>
                <span className="fw-bold" style={{ fontSize: "1.4rem" }}>GitHub</span>
            </a>
     </div>

    </div>
  );
};

export default Home;
