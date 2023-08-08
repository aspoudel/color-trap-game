import React, { useRef, useEffect } from "react";
import { io } from "socket.io-client";

export default function WaitingScreen() {
  let gameSocket = useRef(null);
  useEffect(() => {
    gameSocket.current = io("http://localhost:3000/game");
  });
  return <div>WaitingScreen</div>;
}
