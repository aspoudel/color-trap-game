import React from "react";
import "./Rules.css";
import NavigationBar from "../NavigationBar/NavigationBar";

export default function Rules() {
  return (
    <div>
      <NavigationBar />
      <h1 className="rules-title">Cobra's Den</h1>
      <div className="rule-book">
        <p className="rules-line">
          1. Practice Mode: Here you play only against time to figure out how
          well you square agains yourself. Roll the dice up to get a color and
          then select a tile in random from the bunch. If the tile color matches
          with the dice color you get a point and if not, memorize the position
          of that colored tile that you turn up. In the next subsequent turns,
          if you happen to roll one of the colors that matches with the tiles
          you have already memorized, select the tile and the point is yours.
          Keep practicing to improve your short term memory skills.
        </p>
        <p className="rules-line">
          2. Battle Mode: After spending some time in the practice mode, play
          against players around the world and challenge your skills to others.
          The one who gets the highest points wins the game. May the best
          men/women/others win.
        </p>
      </div>
    </div>
  );
}
