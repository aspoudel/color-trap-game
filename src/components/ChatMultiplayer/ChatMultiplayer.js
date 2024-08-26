import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import "./ChatMultiplayer.css";
import chatIcon from "../../assets/icons/chat_icon.svg";

export default function ChatMultiplayer(props) {
  const { gameRoomId } = props;
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
  const messageRef = useRef();
  // Socket reference so that we deal with the same socket in a particular client instance.
  const chatSocket = useRef(null);
  const nonStateIsOpen = useRef(false);

  // Toggler function to open or close the chat drawer.
  const toggleSlider = () => {
    setIsOpen(!isOpen);
    setNewMessages((prevMessages) => 0);
    nonStateIsOpen.current = !nonStateIsOpen.current;
  };

  useEffect(() => {
    // Initializing the chat socket.
    chatSocket.current = io(
      "https://www.color-trap-game-api.onrender.com/chat",
      {
        auth: { gameRoomId: gameRoomId.current },
      }
    );

    chatSocket.current.on("connect", () => {});

    // Function whent the chat socket receives a message from the server.
    chatSocket.current.on("receive-message", (message) => {
      displayMessage(message);
    });

    if (messageRef.current) {
      if (shouldAutoFocus) {
        messageRef.current.focus();
        setShouldAutoFocus(true);
      }
    }

    return () => {
      chatSocket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messageRef.current.focus();
    }
  }, [isOpen]);

  // Function to send the message to the server.
  function sendMessage(e) {
    e.preventDefault();
    const message = messageRef.current.value;
    displayMessage(message);
    chatSocket.current.emit("send-message", message, gameRoomId.current);
    messageRef.current.value = "";
  }

  // Function to display the message
  function displayMessage(newMessage) {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    if (!nonStateIsOpen.current) {
      setNewMessages((prevNumber) => prevNumber + 1);
    }
  }

  return (
    <div className={`slider-chat ${isOpen ? "open" : ""}`}>
      <div className={`slider-content ${isOpen ? "open" : ""}`}>
        <div>
          <div className="chat-box">
            {messages &&
              messages.map((message, index) => {
                return <p key={index}>{message}</p>;
              })}
          </div>
          <form onSubmit={sendMessage}>
            <div className="message">
              <input
                ref={messageRef}
                id="messageText"
                type="text"
                autoFocus={false}
              ></input>
              <button id="sendButton">Send</button>
            </div>
          </form>
        </div>
      </div>
      <div
        className={`slider-button ${isOpen ? "open" : ""}`}
        onClick={toggleSlider}
      >
        <img src={chatIcon} className="slider-icon"></img>
        {newMessages !== 0 && (
          <div className="message-count">{newMessages}</div>
        )}
      </div>
    </div>
  );
}
