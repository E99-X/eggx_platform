import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Demo from "./components/pages/Demo";
import Mvp from "./components/pages/Mvp";

import Faas from "./components/pages/Faas";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="site-container">
        <Routes>
          <Route path="/" element={<Demo />} />
          <Route path="/mvp" element={<Mvp />} />
          <Route path="/faas" element={<Faas />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
