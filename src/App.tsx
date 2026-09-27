import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Projects from "./components/Projects";
import { Routes, Route } from "react-router-dom";
import ContactWidget from "./components/ContactWidget";
import AboutMe from "./components/AboutMe";
import BallCursor from "./components/BallCursor";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div style={{ width: "100vw", minHeight: "100vh", overflowX: "clip" }}>
      <Navbar />

      <div style={{ minHeight: "calc(100vh - 64px)" }}>
        <Routes>
          <Route path="/" element={ <Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path ="/about-me" element={<AboutMe/>} />
        </Routes>
      </div>
      <ContactWidget />
      <BallCursor />

    </div>
  );
}

export default App;
