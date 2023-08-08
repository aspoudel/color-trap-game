import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import "./ChatMultiplayer.css";

export default function ChatMultiplayer() {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const messageRef = useRef();
  // Socket reference so that we deal with the same socket in a particular client instance.
  const chatSocket = useRef(null);

  // Toggler function to open or close the chat drawer.
  const toggleSlider = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Initializing the chat socket.
    chatSocket.current = io("http://localhost:3000/chat");

    chatSocket.current.on("connect", () => {});

    // Function whent the chat socket receives a message from the server.
    chatSocket.current.on("receive-message", (message) => {
      displayMessage(message);
    });

    return () => {
      chatSocket.current.disconnect();
    };
  }, []);

  // Function to send the message to the server.
  function sendMessage(e) {
    e.preventDefault();
    const message = messageRef.current.value;
    displayMessage(message);
    chatSocket.current.emit("send-message", message);
    messageRef.current.value = "";
  }

  // Function to display the message
  function displayMessage(newMessage) {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
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
              <input ref={messageRef} id="messageText" type="text"></input>
              <button id="sendButton">Send</button>
            </div>
          </form>
        </div>
      </div>
      <div
        className={`slider-button ${isOpen ? "open" : ""}`}
        onClick={toggleSlider}
      >
        <div className="slider-icon"></div>
      </div>
    </div>
  );
}
