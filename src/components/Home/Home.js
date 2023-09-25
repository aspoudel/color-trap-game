import React from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";
import "./Home.css";
import BattleImage from "../../assets/Battle.jpg";
import PracticeImage from "../../assets/Practice.jpg";

export default function Home() {
  return (
    <div className="cobras-home">
      <NavigationBar />
      <h1 className="title">Cobra's Den</h1>
      <p className="post-title">
        Get&nbsp;&nbsp;Ready&nbsp;&nbsp;For&nbsp;&nbsp;Battle
      </p>
      <div className="game-modes">
        <Link className="game-mode-links" to="/singlePlayerGame">
          <div className="background-changer"></div>
          <img className="game-mode-image" src={BattleImage}></img>
          <p className="game-mode-text">Practice</p>
        </Link>
        <div className="game-mode-link-seperator"></div>
        <Link className="game-mode-links" to="/multiPlayerGame">
          <div className="background-changer"></div>
          <img className="game-mode-image" src={PracticeImage}></img>
          <p className="game-mode-text">Battle</p>
        </Link>
      </div>
    </div>
  );
}
