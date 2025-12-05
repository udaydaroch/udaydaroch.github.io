import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Projects from "./components/Projects";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div style={{ width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <div style={{ minHeight: "calc(100vh - 60px)" }}>
        <Routes>
          <Route path="/" element={ <Home />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
