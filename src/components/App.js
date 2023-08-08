import React from "react";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SinglePlayerGame from "./SinglePlayerGame/SinglePlayerGame";
import MultiPlayerGame from "./MultiPlayerGame/MultiPlayerGame";
import WaitingScreen from "./WaitingScreen/WaitingScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/singlePlayerGame" element={<MultiPlayerGame />} />
        <Route path="/multiPlayerGame" element={<MultiPlayerGame />} />
        <Route path="/waitingForPlayers" element={<WaitingScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
