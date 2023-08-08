import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Link to="/singlePlayerGame">Single Player</Link>
      <br></br>
      <Link to="/waitingForPlayers">Multi Player</Link>
    </div>
  );
}
