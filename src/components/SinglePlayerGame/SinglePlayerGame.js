import React, { useState, useEffect, useRef } from "react";
import { initialTiles, diceColors } from "../../constants/singlePlayerTiles";
import "./SinglePlayerGame.css";
import { io } from "socket.io-client";

export default function SinglePlayerGame() {
  const [tiles, setTiles] = useState([]);
  const [color, setColor] = useState("#000");
  const [score, setScore] = useState(0);
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [shouldStartTimer, setShouldStartTimer] = useState(false);
  const [shouldPickColor, setShouldPickColor] = useState(false);
  const [shouldRollDice, setShouldRollDice] = useState(true);
  const [isTilesClickAllowed, setIsTilesClickAllowed] = useState(false);

  const tilesClickedNotAllowedClass = "single-player-color-tiles-not-allowed";

  // Socket reference so that we deal with the same socket in a particular client instance.
  const gameSocket = useRef(null);

  // useEffect to shuffle the tiles only when the component is rendered the first time.
  useEffect(() => {
    gameSocket.current = io("http://localhost:3000/game");

    gameSocket.current.on(
      "start-resume-game",
      (gameState, timeInSeconds, index) => {
        timeConverter(timeInSeconds);
        setTiles(initialTiles);
      }
    );

    // Socket connection to update the timer received from the server.
    gameSocket.current.on("receive-updated-timer", (timeInSeconds) => {
      timeConverter(timeInSeconds);
    });

    // Event listener to listen to when the client goes into the background
    // because modern browsers throttle the execution of javascript timers to
    // to optimize performance and conserve system resources for inactive tabs.
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // useEffect to start the time after the dice is rolled.
  useEffect(() => {
    if (shouldStartTimer) {
      setTimeout(() => {
        startTime();
      }, 1000);
    }
  }, [shouldStartTimer]);

  // Function to update the timer based on the server side timer whenever the
  // client comes to the visible state from the background.
  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      gameSocket.current.emit("request-updated-timer");
    }
  }

  /*
  // Function to shuffle the array of tiles.
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      let temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
  }*/

  // Function to start the timer after dice roll.
  function startTime() {
    setSeconds((prevSeconds) => {
      let s = parseInt(prevSeconds) + 1;
      if (s >= 60) {
        setMinutes((prevMinutes) => {
          let m = parseInt(prevMinutes) + 1;
          let mtr = m.toString();
          if (mtr.length < 2) {
            mtr = "0" + mtr;
          }
          return mtr;
        });
        s = 0;
      }
      let str = s.toString();
      if (str.length < 2) {
        str = "0" + str;
      }
      return str;
    });
    setTimeout(() => {
      startTime();
    }, 1000);
  }

  // Fuction to change the color of the tile after clicking on the tile.
  function singlePlayerColorTileClicked(index) {
    if (shouldPickColor) {
      const targetElement = document.querySelectorAll(
        ".single-player-color-tiles"
      )[index];
      targetElement.style.backgroundColor = tiles[index].color;
      setTimeout(() => {
        if (color === tiles[index].color) {
          tiles[index].matched = true;
          const updatedTiles = [...tiles];
          updatedTiles[index].matched = true;
          setTiles(updatedTiles);
          setScore(score + 1);
        } else {
          targetElement.style.backgroundColor = "#343434";
        }
      }, 1000);
      setShouldPickColor(false);
      setShouldRollDice(true);
      setIsTilesClickAllowed(false);
    }
  }

  // Function to roll the dice.
  function rollDice() {
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

  function timeConverter(timeInSeconds) {
    const min = Math.floor(timeInSeconds / 60);
    const sec = timeInSeconds % 60;
    let minutes = min.toString();
    if (minutes.length < 2) {
      minutes = "0" + minutes;
    }
    let seconds = sec.toString();
    if (seconds.length < 2) {
      seconds = "0" + seconds;
    }
    setMinutes(minutes.toString());
    setSeconds(seconds.toString());
  }

  return (
    <div className="single-player-tiles-dice">
      <div className="timer">
        <p>{minutes}:</p>
        <p>{seconds}</p>
      </div>
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
                          singlePlayerColorTileClicked(index + childIndex);
                        }}
                        style={{
                          backgroundColor: childElement.matched
                            ? "#fff"
                            : "#343434",
                        }}
                      ></div>
                    ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="single-player-dice-wrapper">
        <div className="single-player-dice">
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
    </div>
  );
}
