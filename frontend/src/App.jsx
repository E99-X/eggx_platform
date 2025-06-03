import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PullToRefresh from "pulltorefreshjs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Demo from "./components/pages/Demo";
import Mvp from "./components/pages/Mvp";
import Faas from "./components/pages/Faas";
import DashboardWrapper from "./components/DashboardWrapper";

export default function App() {
  useEffect(() => {
    PullToRefresh.init({
      mainElement: "body",
      instructionsPullToRefresh: "Pull down to refresh",
      instructionsReleaseToRefresh: "Release to refresh",
      instructionsRefreshing: "Refreshing...",
      onRefresh() {
        window.location.reload();
      },
    });
    return () => PullToRefresh.destroyAll();
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="site-container">
        <Routes>
          <Route path="/" element={<Demo />} />
          <Route path="/mvp" element={<Mvp />} />
          <Route path="/faas" element={<Faas />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
