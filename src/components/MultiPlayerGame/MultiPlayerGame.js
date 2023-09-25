import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./MultiPlayerGame.css";
import ChatMultiplayer from "../ChatMultiplayer/ChatMultiplayer";
import { io } from "socket.io-client";
import person_icon from "../../assets/icons/player_icon.svg";
import { Howl, Howler } from "howler";
import diceRollAudio from "../../assets/audio/dice_roll.mp3";
import rigthTileAudio from "../../assets/audio/right_tile.mp3";
import gameWonAudio from "../../assets/audio/game_won.mp3";
import gameLostAudio from "../../assets/audio/game_lost.mp3";
import ReactConfetti from "react-confetti";

export default function MultiPlayerGame(props) {
  const {
    isTilesClickAllowed,
    setIsTilesClickAllowed,
    isRollDiceAllowed,
    setIsRollDiceAllowed,
    playerWon,
    setPlayerWon,
    playerLost,
    setPlayerLost,
    tiles,
    setTiles,
    diceColor,
    setDiceColor,
    shouldStartTimer,
    setShouldStartTimer,
    minutes,
    setMinutes,
    seconds,
    setSeconds,
    setCounter1,
    setCounter2,
    setCounter3,
    setCounter4,
    playerCode1,
    gameRoomId,
    gameSocket,
    timer1,
    timer2,
    timer3,
    timer4,
    setShowPlayerOneTimer,
    setShowPlayerTwoTimer,
    setShowPlayerThreeTimer,
    setShowPlayerFourTimer,
  } = props;
  const [score, setScore] = useState(0);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [windowDimension, setDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const detectSize = () => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  };
  const [shouldRunConfetti, setShouldRunConfetti] = useState(false);

  const tilesClickedNotAllowedClass = "multi-player-color-tiles-not-allowed";

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, []);

  // useEffect to shuffle the tiles only when the component is rendered the first time.
  useEffect(() => {
    // Socket connection to update the timer received from the server.
    gameSocket.current.on("receive-updated-timer", (timeInSeconds) => {
      timeConverter(timeInSeconds);
    });

    // Socket connection to update the game state after the tiles click and the match check is done in the server.
    gameSocket.current.on(
      "multi-player-tiles-clicked-receive",
      (isMatched, tiles, score, code, nextPlayerCode, isAllowed, won) => {
        setShowPlayerOneTimer(false);
        setShowPlayerTwoTimer(false);
        setShowPlayerThreeTimer(false);
        setShowPlayerFourTimer(false);
        if (isMatched) {
          const sound = new Howl({ src: [rigthTileAudio] });
          sound.play();
          setTiles(tiles);
          if (playerCode1.current === code) {
            setScore(score);
          }
        }
        setIsTilesClickAllowed(isAllowed);
        if (nextPlayerCode === playerCode1.current) {
          setIsRollDiceAllowed(true);
        }
        if (won != null) {
          setIsRollDiceAllowed(false);
          if (won === playerCode1.current) {
            setShouldRunConfetti(true);
            setPlayerWon(true);
            const sound = new Howl({ src: [gameWonAudio] });
            sound.play();
            setTimeout(() => {
              setShouldRunConfetti(false);
            }, 5000);
          } else {
            setPlayerLost(true);
            const sound = new Howl({ src: [gameLostAudio] });
            sound.play();
          }
        }
      }
    );

    // Socket connection to update a player's turn change
    gameSocket.current.on(
      "player-turn-change",
      (isMatched, tiles, score, code, nextPlayerCode, isAllowed, won) => {
        setIsTilesClickAllowed(isAllowed);
        if (code === playerCode1.current) {
          setIsRollDiceAllowed(false);
        }
        console.log(nextPlayerCode + " should have its dice allowed");
        if (nextPlayerCode === playerCode1.current) {
          setIsRollDiceAllowed(true);
        }
      }
    );

    // Socket connection to perform dice roll with the server result.
    gameSocket.current.on(
      "roll-dice-receive",
      (diceColor, code, isTilesClickAllowed) => {
        setIsDiceRolling(false);
        setDiceColor(diceColor);
        if (playerCode1.current === code) {
          setIsTilesClickAllowed(isTilesClickAllowed);
        }
      }
    );

    // Event listener to listen to when the client goes into the background
    // because modern browsers throttle the execution of javascript timers to
    // to optimize performance and conserve system resources for inactive tabs.
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // useEffect cleaner to run at component unmount.
    return () => {
      gameSocket.current.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // useEffect to start the time after the dice is rolled.
  useEffect(() => {
    let timerId;
    if (shouldStartTimer && !playerWon && !playerLost) {
      setTimeout(startTimer, 1000);
    }

    // Function to start the timer after dice roll.
    function startTimer() {
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
      if (shouldStartTimer && !playerWon && !playerLost) {
        timerId = setTimeout(startTimer, 1000);
      }
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [shouldStartTimer, playerWon, playerLost]);

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

  // Function to update the timer based on the server side timer whenever the
  // client comes to the visible state from the background.
  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      gameSocket.current.emit("request-updated-timer", gameRoomId.current);
    }
  }

  // Fuction to change the color of the tile after clicking on the tile.
  function multiPlayerColorTileClicked(index, matched) {
    if (isTilesClickAllowed && !matched) {
      setIsTilesClickAllowed(false);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setTimeout(() => {
        setCounter1(10);
        setCounter2(10);
        setCounter3(10);
        setCounter4(10);
      }, 2000);

      const targetElement = document.querySelectorAll(
        ".multi-player-color-tiles"
      )[index];
      targetElement.style.backgroundColor = tiles[index].color;
      setTimeout(() => {
        targetElement.style.backgroundColor = "#E3E3E3";
        gameSocket.current.emit(
          "multi-player-tiles-clicked-request",
          index,
          playerCode1.current,
          gameRoomId.current
        );
      }, 1000);
    }
  }

  // Function to call roll dice in the server.
  function rollDice() {
    const sound = new Howl({ src: [diceRollAudio] });
    sound.play();
    setIsRollDiceAllowed(false);
    setIsDiceRolling(true);
    gameSocket.current.emit(
      "roll-dice-request",
      playerCode1.current,
      gameRoomId.current
    );
  }
  Howler.volume(1.0);
  return (
    <React.Fragment>
      <div className="multi-player-tiles-dice">
        <div className="timer">
          <p>{minutes}:</p>
          <p>{seconds}</p>
        </div>
        <div className="multi-player-score">
          <p className="multi-player-score-heading">Score:</p>
          <p className="multi-player-score-value">{score}</p>
        </div>
        <div className="multi-player-color-tiles-wrapper">
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
                              ? "multi-player-color-tiles "
                              : "multi-player-color-tiles " +
                                tilesClickedNotAllowedClass
                          }
                          key={index + childIndex}
                          onClick={() => {
                            multiPlayerColorTileClicked(
                              index + childIndex,
                              childElement.matched
                            );
                          }}
                          style={{
                            backgroundColor: childElement.matched
                              ? "#292929"
                              : "#E3E3E3",
                          }}
                        ></div>
                      ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="multi-player-dice-wrapper">
          <div className="multi-player-dice">
            <div
              className={
                isDiceRolling
                  ? "multi-player-dice-color-holder dice-rolling"
                  : "multi-player-dice-color-holder"
              }
              style={{ backgroundColor: diceColor }}
            ></div>
          </div>
        </div>
        <div className="multi-player-roll-dice-button-wrapper">
          <button
            className="multi-player-roll-dice-button"
            disabled={!isRollDiceAllowed}
            onClick={rollDice}
          >
            Roll Dice
          </button>
        </div>

        {isTilesClickAllowed && (
          <p className="multi-player-roll-dice-text">Pick a color now!</p>
        )}
        {isRollDiceAllowed && (
          <p className="multi-player-roll-dice-text">Roll the dice now!</p>
        )}

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
        {playerLost && (
          <div className="congrats-text">
            <p className="loser-text">You Lost!</p>
            <p className="lost-subtitle">But we are proud you tried</p>
          </div>
        )}
      </div>
      <ChatMultiplayer gameRoomId={gameRoomId}></ChatMultiplayer>
    </React.Fragment>
  );
}
