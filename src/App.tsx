import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Projects from "./components/Projects";
import { Routes, Route } from "react-router-dom";
import ContactWidget from "./components/ContactWidget";
import AboutMe from "./components/AboutMe";
function App() {
  return (
    <div style={{ width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <div style={{ minHeight: "calc(100vh - 60px)" }}>
        <Routes>
          <Route path="/" element={ <Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path ="/about-me" element={<AboutMe/>} />
        </Routes>
      </div>
      <ContactWidget />

    </div>
  );
}

export default App;
