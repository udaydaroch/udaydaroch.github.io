import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand bg-dark navbar-dark sticky-top">
      <div className="container d-flex justify-content-center">

        <ul className="navbar-nav gap-4">
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                "nav-link fs-5" + (isActive ? " active fw-bold" : "")
              }
              to="/"
            >
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                "nav-link fs-5" + (isActive ? " active fw-bold" : "")
              }
              to="/projects"
            >
              Projects
            </NavLink>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
