import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavigationBar.css";

export default function () {
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  function openRulesPage() {
    setActiveLink("/rules");
    navigate("/rules");
  }

  function openHomePage() {
    setActiveLink("/");
    navigate("/");
  }

  return (
    <div className="navigation-bar">
      <div
        className={`home ${activeLink === "/" ? "active" : ""}`}
        onClick={openHomePage}
      >
        Home
      </div>
      <div
        className={`rules ${activeLink === "/rules" ? "active" : ""}`}
        onClick={openRulesPage}
      >
        Rules
      </div>
    </div>
  );
}
