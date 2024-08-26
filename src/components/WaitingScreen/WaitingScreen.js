import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import person_icon from "../../assets/icons/player_icon.svg";
import opponent_icon from "../../assets/icons/opponent_icon.svg";
import playerPlaceholder from "../../assets/icons/waiting_for_player.svg";
import "./WaitingScreen.css";
import MultiPlayerGame from "../MultiPlayerGame/MultiPlayerGame";
import Radar from "../Radar/Radar";
import TimerBar from "../TimerBar/TimerBar";
import HackTimer from "hacktimer/HackTimer";

export default function WaitingScreen() {
  const [isTilesClickAllowed, setIsTilesClickAllowed] = useState(false);
  const [isRollDiceAllowed, setIsRollDiceAllowed] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [playerLost, setPlayerLost] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [diceColor, setDiceColor] = useState("#000");
  const [shouldStartTimer, setShouldStartTimer] = useState(false);
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [players, setPlayers] = useState([]);
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);
  const [counter4, setCounter4] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
  const [shouldDisplayPlayersRequired, setShouldDisplayPlayersRequired] =
    useState(false);
  const playerCode1 = useRef(null);
  const playerCode2 = useRef(null);
  const playerCode3 = useRef(null);
  const playerCode4 = useRef(null);
  const gameRoomId = useRef(null);
  const [showPlayerOneTimer, setShowPlayerOneTimer] = useState(false);
  const [showPlayerTwoTimer, setShowPlayerTwoTimer] = useState(false);
  const [showPlayerThreeTimer, setShowPlayerThreeTimer] = useState(false);
  const [showPlayerFourTimer, setShowPlayerFourTimer] = useState(false);

  let timer1 = null;
  let timer2 = null;
  let timer3 = null;
  let timer4 = null;
  // Socket reference so that we deal with the same socket in a particular client instance.
  let gameSocket = useRef(null);
  useEffect(() => {
    gameSocket.current = io("https://api.colortrapgame.com/game");

    // Socket connection to set the initial game state from the server.
    gameSocket.current.on(
      "load-game",
      (gameState, timeInSeconds, code, roomId) => {
        timeConverter(timeInSeconds);
        playerCode1.current = code;
        gameRoomId.current = roomId;

        // if (code === ) {
        //   setIsRollDiceAllowed(true);
        // }

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
      setPlayers(playersArray);
      for (let i of playersArray) {
        if (i != playerCode1.current && playerCode2.current === null) {
          playerCode2.current = i;
        } else if (
          i != playerCode1.current &&
          i != playerCode2.current &&
          playerCode3.current === null
        ) {
          playerCode3.current = i;
        } else if (
          i != playerCode1.current &&
          i != playerCode2.current &&
          i != playerCode3.current &&
          playerCode4.current === null
        ) {
          playerCode4.current = i;
        }
      }
    });

    gameSocket.current.on("player-left-event", (playerIndex, newPlayers) => {
      setPlayers(newPlayers);
    });

    let cc = null;
    gameSocket.current.on("player-timer-call", (code) => {
      cc = code;
      if (playerCode1.current === code) {
        setShowPlayerOneTimer(true);
        setCounter1(10);
        setTimeout(() => {
          setCounter1((prevCounter) => prevCounter - 1);
          playerTimerCall1();
        }, 1000);
      } else if (playerCode2.current == code) {
        setShowPlayerTwoTimer(true);
        setCounter2(10);
        setTimeout(() => {
          setCounter2((prevCounter) => prevCounter - 1);
          playerTimerCall2();
        }, 1000);
      } else if (playerCode3.current == code) {
        setShowPlayerThreeTimer(true);
        setCounter3(10);
        setTimeout(() => {
          setCounter3((prevCounter) => prevCounter - 1);
          playerTimerCall3();
        }, 1000);
      } else if (playerCode4.current == code) {
        setShowPlayerFourTimer(true);
        setCounter4(10);
        setTimeout(() => {
          setCounter4((prevCounter) => prevCounter - 1);
          playerTimerCall4();
        }, 1000);
      }
    });

    function playerTimerCall1() {
      if (playerCode1.current === cc) {
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

    // Socket connection to fire up the game screen from the waiting screen.
    gameSocket.current.on(
      "start-game-screen",
      (code, serverShouldStartTimer) => {
        setShouldRender(true);
        if (code === playerCode1.current) {
          setIsRollDiceAllowed(true);
        }
        if (serverShouldStartTimer) {
          setShouldStartTimer(serverShouldStartTimer);
        }
      }
    );

    return () => {
      gameSocket.current.disconnect();
    };
  }, []);

  // To access the counter only after its value changes.
  useEffect(() => {
    // Clearing the timer after 10 seconds.
    if (counter1 <= 0) {
      setShowPlayerOneTimer(false);
      clearTimeout(timer1);
      setCounter1(0);
    }
    if (counter2 <= 0) {
      setShowPlayerTwoTimer(false);
      clearTimeout(timer2);
      setCounter2(0);
    }
    if (counter3 <= 0) {
      setShowPlayerThreeTimer(false);
      clearTimeout(timer3);
      setCounter3(0);
    }
    if (counter4 <= 0) {
      setShowPlayerFourTimer(false);
      clearTimeout(timer4);
      setCounter4(0);
    }
  }, [counter1, counter2, counter3, counter4]);

  useEffect(() => {
    if (players.length > 1) {
      setShouldDisplayPlayersRequired(false);
    }
  }, [players]);

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

  function startGame() {
    if (players.length !== 1) {
      setShouldRender(true);
      gameSocket.current.emit(
        "start-game",
        gameRoomId.current,
        playerCode1.current
      );
    } else {
      setShouldDisplayPlayersRequired(true);
    }
  }

  return (
    <div className="waiting-screen-container">
      <div className="corner player-icon-top-left">
        {players.length >= 2 ? (
          <div className="person-icon-holder">
            <img src={opponent_icon}></img>
            {showPlayerTwoTimer && <TimerBar />}
          </div>
        ) : (
          <>
            {!shouldRender && (
              <div className="placeholder-collection">
                <img
                  className="placeholder-image"
                  src={playerPlaceholder}
                ></img>
                <p>Waiting for a player</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="corner player-icon-top-right">
        {players.length >= 3 ? (
          <div className="person-icon-holder">
            {showPlayerThreeTimer && <TimerBar extraMarginRight={true} />}
            <img src={opponent_icon}></img>
          </div>
        ) : (
          <>
            {!shouldRender && (
              <div className="placeholder-collection">
                <img
                  className="placeholder-image"
                  src={playerPlaceholder}
                ></img>
                <p>Waiting for a player</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="corner player-icon-bottom-left">
        {players.length >= 1 ? (
          <div className="person-icon-holder">
            <div>
              <img src={person_icon}></img>
              <p className="player-text">You</p>
            </div>
            {showPlayerOneTimer && <TimerBar />}
          </div>
        ) : (
          <>
            {!shouldRender && (
              <div className="placeholder-collection">
                <img
                  className="placeholder-image"
                  src={playerPlaceholder}
                ></img>
                <p>Waiting for a player</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="corner player-icon-bottom-right">
        {players.length >= 4 ? (
          <div className="person-icon-holder">
            {showPlayerFourTimer && <TimerBar extraMarginRight={true} />}
            <img src={opponent_icon}></img>
          </div>
        ) : (
          <>
            {!shouldRender && (
              <div className="placeholder-collection">
                <img
                  className="placeholder-image"
                  src={playerPlaceholder}
                ></img>
                <p>Waiting for a player</p>
              </div>
            )}
          </>
        )}
      </div>
      {!shouldRender && (
        <div>
          <Radar />
          <button onClick={startGame} className="game-start-button">
            Start Game
          </button>
          {shouldDisplayPlayersRequired && (
            <p className="players-required-warning">
              At least 2 players required. Waiting for players...
            </p>
          )}
        </div>
      )}
      {shouldRender && (
        <MultiPlayerGame
          isTilesClickAllowed={isTilesClickAllowed}
          setIsTilesClickAllowed={setIsTilesClickAllowed}
          isRollDiceAllowed={isRollDiceAllowed}
          setIsRollDiceAllowed={setIsRollDiceAllowed}
          playerWon={playerWon}
          setPlayerWon={setPlayerWon}
          playerLost={playerLost}
          setPlayerLost={setPlayerLost}
          tiles={tiles}
          setTiles={setTiles}
          diceColor={diceColor}
          setDiceColor={setDiceColor}
          shouldStartTimer={shouldStartTimer}
          setShouldStartTimer={setShouldStartTimer}
          minutes={minutes}
          setMinutes={setMinutes}
          seconds={seconds}
          setSeconds={setSeconds}
          setCounter1={setCounter1}
          setCounter2={setCounter2}
          setCounter3={setCounter3}
          setCounter4={setCounter4}
          playerCode1={playerCode1}
          gameRoomId={gameRoomId}
          gameSocket={gameSocket}
          timer1={timer1}
          timer2={timer2}
          timer3={timer3}
          timer4={timer4}
          setShowPlayerOneTimer={setShowPlayerOneTimer}
          setShowPlayerTwoTimer={setShowPlayerTwoTimer}
          setShowPlayerThreeTimer={setShowPlayerThreeTimer}
          setShowPlayerFourTimer={setShowPlayerFourTimer}
        />
      )}
    </div>
  );
}
