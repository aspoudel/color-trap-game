import React from "react";
import Home from "./Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SinglePlayerGame from "./SinglePlayerGame/SinglePlayerGame";
import WaitingScreen from "./WaitingScreen/WaitingScreen";
import Rules from "./Rules/Rules";
import About from "./About/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/singlePlayerGame" element={<SinglePlayerGame />} />
        <Route path="/multiPlayerGame" element={<WaitingScreen />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/about" element={<About />} />
        <Route
          path="*"
          element={<div className="page-not-found">404 Page Not found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
