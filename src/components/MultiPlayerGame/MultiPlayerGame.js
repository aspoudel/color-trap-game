import React, { useState, useRef, useEffect } from "react";
import "./MultiPlayerGame.css";
import ChatMultiplayer from "../ChatMultiplayer/ChatMultiplayer";
import { io } from "socket.io-client";
import person_icon from "../../assets/icons/player_icon.svg";

export default function MultiPlayerGame() {
  const [tiles, setTiles] = useState([]);
  const [diceColor, setDiceColor] = useState("#000");
  const [score, setScore] = useState(0);
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [shouldStartTimer, setShouldStartTimer] = useState(false);
  const [isTilesClickAllowed, setIsTilesClickAllowed] = useState(false);
  const [isRollDiceAllowed, setIsRollDiceAllowed] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [playerLost, setPlayerLost] = useState(false);
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);
  const [counter4, setCounter4] = useState(0);
  const [players, setPlayers] = useState([]);
  let timer1 = null;
  let timer2 = null;
  let timer3 = null;
  let timer4 = null;

  // Socket reference so that we deal with the same socket in a particular client instance.
  const gameSocket = useRef(null);
  const playerCode1 = useRef(null);
  const playerCode2 = useRef(null);
  const playerCode3 = useRef(null);
  const playerCode4 = useRef(null);
  const gameRoomId = useRef(null);
  const tilesClickedNotAllowedClass = "multi-player-color-tiles-not-allowed";

  // useEffect to shuffle the tiles only when the component is rendered the first time.
  useEffect(() => {
    gameSocket.current = io("http://localhost:3000/game");

    // Socket connection to set the initial game state from the server.
    gameSocket.current.on(
      "load-game",
      (gameState, timeInSeconds, code, roomId) => {
        timeConverter(timeInSeconds);
        playerCode1.current = code;
        gameRoomId.current = roomId;
        console.log(gameState);
        console.log(roomId);
        if (code === 0) {
          setIsRollDiceAllowed(true);
        }

        // This piece of code will probably not work right now because whenever we
        // refresh the screen after the game is over the client will get a new
        // game socket Id.
        if (gameState.playerWon) {
          if (code === gameState.playerWon) {
            setPlayerWon(true);
          } else {
            setPlayerLost(true);
          }
        }
        setTiles(gameState.tiles);
        setDiceColor(gameState.diceColor);
        setIsTilesClickAllowed(gameState.isTilesClickAllowed);
        if (gameState.shouldStartTimer === true) {
          setShouldStartTimer(gameState.shouldStartTimer);
          setMinutes(gameState.minutes);
          setSeconds(gameState.seconds);
        }
      }
    );

    gameSocket.current.on("players-joined", (playersArray, code) => {
      console.log(playersArray);
      setPlayers(playersArray);
      for (let i in playersArray) {
        if (i != playerCode1.current && playerCode2.current === null) {
          console.log("Dusra khiladi " + i);
          playerCode2.current = i;
          console.log(playerCode2.current);
        } else if (
          i != playerCode1.current &&
          i != playerCode2.current &&
          playerCode3.current === null
        ) {
          console.log("Teesra khiladi " + i);
          playerCode3.current = i;
        } else if (
          i != playerCode1.current &&
          i != playerCode2.current &&
          i != playerCode3.current &&
          playerCode4.current === null
        ) {
          console.log("Chautha khiladi " + i);
          playerCode4.current = i;
        }
      }
    });

    // Socket connection to update the timer received from the server.
    gameSocket.current.on("receive-updated-timer", (timeInSeconds) => {
      console.log("Got updated timer");
      timeConverter(timeInSeconds);
    });

    // Socket connection to update the game state after the tiles click and the match check is done in the server.
    gameSocket.current.on(
      "multi-player-tiles-clicked-receive",
      (isMatched, tiles, score, code, nextPlayerCode, isAllowed, won) => {
        console.log("Got multi player tiles clicked");
        if (isMatched) {
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
            setPlayerWon(true);
          } else {
            setPlayerLost(true);
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
        if (nextPlayerCode === playerCode1.current) {
          setIsRollDiceAllowed(true);
        }
      }
    );

    let cc = null;
    gameSocket.current.on("player-timer-call", (code) => {
      cc = code;
      console.log(code, "'s turn now");
      console.log(playerCode2.current + " " + code);
      console.log(playerCode2.current == code); // This gives true
      if (playerCode1.current === code) {
        console.log("His turn");
        //clearInterval(timer);
        setCounter1(10);
        setTimeout(() => {
          setCounter1((prevCounter) => prevCounter - 1);
          playerTimerCall1();
        }, 1000);
      } else if (playerCode2.current == code) {
        // While this not
        console.log("mera bhi");
        setCounter2(10);
        setTimeout(() => {
          setCounter2((prevCounter) => prevCounter - 1);
          playerTimerCall2();
        }, 1000);
      } else if (playerCode3.current == code) {
        console.log("mera mera");
        setCounter3(10);
        setTimeout(() => {
          setCounter3((prevCounter) => prevCounter - 1);
          playerTimerCall3();
        }, 1000);
      } else if (playerCode4.current == code) {
        console.log("haan ji me akhri");
        setCounter4(10);
        setTimeout(() => {
          setCounter4((prevCounter) => prevCounter - 1);
          playerTimerCall4();
        }, 1000);
      }
    });

    function playerTimerCall1() {
      if (playerCode1.current === cc) {
        console.log("Timer 1 function called");
        timer1 = setTimeout(() => {
          setCounter1((prevCounter) => prevCounter - 1);
          playerTimerCall1();
        }, 1000);
      }
    }

    function playerTimerCall2() {
      if (playerCode2.current == cc) {
        timer2 = setTimeout(() => {
          setCounter2((prevCounter) => prevCounter - 1);
          playerTimerCall2();
        }, 1000);
      }
    }

    function playerTimerCall3() {
      if (playerCode3.current == cc) {
        timer3 = setTimeout(() => {
          setCounter3((prevCounter) => prevCounter - 1);
          playerTimerCall3();
        }, 1000);
      }
    }

    function playerTimerCall4() {
      if (playerCode4.current == cc) {
        timer4 = setTimeout(() => {
          setCounter4((prevCounter) => prevCounter - 1);
          playerTimerCall4();
        }, 1000);
      }
    }

    // Socket connection to perform dice roll with the server result.
    gameSocket.current.on(
      "roll-dice-receive",
      (diceColor, code, isTilesClickAllowed, serverShouldStartTimer) => {
        console.log(
          "Here",
          diceColor,
          code,
          isTilesClickAllowed,
          serverShouldStartTimer
        );
        setDiceColor(diceColor);
        if (serverShouldStartTimer) {
          setShouldStartTimer(serverShouldStartTimer);
        }
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

  // To access the counter only after its value changes.
  useEffect(() => {
    // Clearing the timer after 10 seconds.
    if (counter1 <= 0) {
      clearTimeout(timer1);
      setCounter1(0);
      console.log("Timer 1 function cleared");
    }
    if (counter2 <= 0) {
      clearTimeout(timer2);
      setCounter2(0);
      console.log("Timer 2 function cleared");
    }
    if (counter3 <= 0) {
      clearTimeout(timer3);
      setCounter3(0);
      console.log("Timer 3 function cleared");
    }
    if (counter4 <= 0) {
      clearTimeout(timer4);
      setCounter4(0);
      console.log("Timer 4 function cleared");
    }
  }, [counter1, counter2, counter3, counter4]);

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

      console.log("All timer function cleared");
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
        targetElement.style.backgroundColor = "#343434";
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
    console.log("Player Code: ", playerCode1);
    setIsRollDiceAllowed(false);
    gameSocket.current.emit(
      "roll-dice-request",
      playerCode1.current,
      gameRoomId.current
    );
  }

  function startGame() {
    gameSocket.current.emit(
      "start-game",
      gameRoomId.current,
      playerCode1.current
    );
  }

  return (
    <div className="multi-player-tiles-dice">
      {players.length >= 2 && (
        <div className="corner player-icon-top-left">
          <img src={person_icon}></img>
          <p>{counter2}</p>
        </div>
      )}
      {players.length >= 3 && (
        <div className="corner player-icon-top-right">
          <img src={person_icon}></img>
          <p>{counter3}</p>
        </div>
      )}
      {players.length >= 1 && (
        <div className="corner player-icon-bottom-left">
          <img src={person_icon}></img>
          <p>{counter1}</p>
        </div>
      )}
      {players.length === 4 && (
        <div className="corner player-icon-bottom-right">
          <img src={person_icon}></img>
          <p>{counter4}</p>
        </div>
      )}
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
      <div className="multi-player-dice-wrapper">
        <div className="multi-player-dice">
          <div
            className="multi-player-dice-color-holder"
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
      <button onClick={startGame} className="game-start-button">
        Start Game
      </button>
      {isTilesClickAllowed && (
        <p className="multi-player-roll-dice-text">Pick a color now!</p>
      )}
      {isRollDiceAllowed && (
        <p className="multi-player-roll-dice-text">Roll the dice now!</p>
      )}

      {playerWon && <p className="congrats-text winner-text">You Won!</p>}
      {playerLost && <p className="congrats-text loser-text">You Lost!</p>}

      <ChatMultiplayer></ChatMultiplayer>
    </div>
  );
}
