import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container d-flex justify-content-center">

        <ul className="navbar-nav gap-4">

          <li className="nav-item">
            <NavLink
              end
              className={({ isActive }) =>
                `nav-link fs-5 px-3 py-2 rounded ${
                  isActive ? "active fw-bold bg-secondary" : "nav-hover"
                }`
              }
              to="/"
            >
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `nav-link fs-5 px-3 py-2 rounded ${
                  isActive ? "active fw-bold bg-secondary" : "nav-hover"
                }`
              }
              to="/projects"
            >
              Projects
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `nav-link fs-5 px-3 py-2 rounded ${
                  isActive ? "active fw-bold bg-secondary" : "nav-hover"
                }`
              }
              to="/about-me"
            >
              About Me
            </NavLink>
          </li>

        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
