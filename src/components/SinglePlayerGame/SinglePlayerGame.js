import React, { useState, useEffect, useRef } from "react";
import { diceColors } from "../../constants/singlePlayerTiles";
import "./SinglePlayerGame.css";
import { io } from "socket.io-client";
import { Howl, Howler } from "howler";
import diceRollAudio from "../../assets/audio/dice_roll.mp3";
import rigthTileAudio from "../../assets/audio/right_tile.mp3";
import gameWonAudio from "../../assets/audio/game_won.mp3";
import ReactConfetti from "react-confetti";

export default function SinglePlayerGame() {
  const [tiles, setTiles] = useState([]);
  const [color, setColor] = useState("#000");
  const [score, setScore] = useState(0);
  const [shouldStartTimer, setShouldStartTimer] = useState(false);
  const [shouldPickColor, setShouldPickColor] = useState(false);
  const [shouldRollDice, setShouldRollDice] = useState(true);
  const [isTilesClickAllowed, setIsTilesClickAllowed] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [shouldRunConfetti, setShouldRunConfetti] = useState(false);
  const [tilesLeft, setTilesLeft] = useState(25);
  const [windowDimension, setDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const detectSize = () => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  };

  const tilesClickedNotAllowedClass = "single-player-color-tiles-not-allowed";

  // Socket reference so that we deal with the same socket in a particular client instance.
  const gameSocket = useRef(null);

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, []);

  // useEffect to shuffle the tiles only when the component is rendered the first time.
  useEffect(() => {
    gameSocket.current = io("https://www.colortrapgame.com:3000/singlePlayer");

    gameSocket.current.on("load-game", (initialTiles) => {
      setTiles(initialTiles);
      setTilesLeft(initialTiles.length);
    });
  }, []);

  useEffect(() => {
    if (tilesLeft === 0) {
      setShouldRunConfetti(true);
      setPlayerWon(true);
      const sound = new Howl({ src: [gameWonAudio] });
      sound.play();
      setTimeout(() => {
        setShouldRunConfetti(false);
      }, 5000);
    }
  }, [tilesLeft]);
  // Fuction to change the color of the tile after clicking on the tile.
  function singlePlayerColorTileClicked(index, matched) {
    if (shouldPickColor && !matched) {
      const targetElement = document.querySelectorAll(
        ".single-player-color-tiles"
      )[index];
      const childIcon = document.querySelectorAll(".tile-icon")[index];
      targetElement.style.backgroundColor = tiles[index].color;
      targetElement.removeChild(childIcon);
      setTimeout(() => {
        if (color === tiles[index].color) {
          const sound = new Howl({ src: [rigthTileAudio] });
          sound.play();
          tiles[index].matched = true;
          const updatedTiles = [...tiles];
          updatedTiles[index].matched = true;
          setTiles(updatedTiles);
          setScore(score + 1);
          setTilesLeft((prevValue) => prevValue - 1);
        } else {
          targetElement.style.backgroundColor = "#E3E3E3";
        }
        targetElement.appendChild(childIcon);
        setShouldRollDice(true);
        setShouldPickColor(false);
      }, 1000);
      setIsTilesClickAllowed(false);
    }
  }

  // Function to roll the dice.
  function rollDice() {
    if (!shouldPickColor) {
      const sound = new Howl({ src: [diceRollAudio] });
      sound.play();
      const max = diceColors.length - 1;
      const min = 0;
      const range = max - min + 1;
      const randomNumber = Math.floor(Math.random() * range) + min;
      setColor(diceColors[randomNumber]);
      if (!shouldStartTimer) {
        setShouldStartTimer(true);
      }
      setShouldPickColor(true);
      setShouldRollDice(false);
      setIsTilesClickAllowed(true);
    }
  }
  Howler.volume(1.0);
  return (
    <div>
      <div className="back-image"></div>
      <div className="single-player-tiles-dice">
        <div className="single-player-score">
          <p className="single-player-score-heading">Score:</p>
          <p className="single-player-score-value">{score}</p>
        </div>
        <div className="single-player-color-tiles-wrapper">
          {tiles.map((tile, index) => {
            const parentIndex = Math.floor(index / 5);
            const parentKey = `parent-${parentIndex}`;

            return (
              <React.Fragment key={index}>
                {index % 5 === 0 && (
                  <div className="parent-div " key={parentKey}>
                    {tiles
                      .slice(index, index + 5)
                      .map((childElement, childIndex) => (
                        <div
                          className={
                            isTilesClickAllowed
                              ? `single-player-color-tiles ${
                                  childElement.matched ? "tile-matched" : ""
                                }`
                              : `single-player-color-tiles  ${tilesClickedNotAllowedClass}`
                          }
                          key={index + childIndex}
                          onClick={() => {
                            singlePlayerColorTileClicked(
                              index + childIndex,
                              childElement.matched
                            );
                          }}
                          style={{
                            backgroundColor: childElement.matched
                              ? ""
                              : "#E3E3E3",
                          }}
                        >
                          <div
                            className={`tile-icon ${
                              childElement.matched ? "" : "tile-icon-image"
                            }`}
                          ></div>
                        </div>
                      ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="single-player-dice-wrapper">
          <div onClick={rollDice} className="single-player-dice">
            <div
              className="single-player-dice-color-holder"
              style={{ backgroundColor: color }}
            ></div>
          </div>
        </div>
        <div className="single-player-roll-dice-button-wrapper">
          <button
            className="single-player-roll-dice-button"
            disabled={shouldPickColor}
            onClick={rollDice}
          >
            Roll Dice
          </button>
        </div>
        {shouldPickColor && (
          <p className="single-player-roll-dice-text">Pick a color now!</p>
        )}
        {shouldRollDice && (
          <p className="single-player-roll-dice-text">Roll the dice now!</p>
        )}

        <p className="class-text">Practice Mode</p>

        {playerWon && <p className="congrats-text winner-text">You Won!</p>}
        {playerWon && (
          <ReactConfetti
            width={windowDimension.width}
            height={windowDimension.height}
            tweenDuration={1000}
            gravity={0.05}
            recycle={shouldRunConfetti}
          />
        )}
      </div>
    </div>
  );
}
