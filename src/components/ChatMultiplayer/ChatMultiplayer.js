import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import "./ChatMultiplayer.css";
import chatIcon from "../../assets/icons/chat_icon.svg";

export default function ChatMultiplayer(props) {
  const { gameRoomId } = props;
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [messageReceviedAlert, setMessageReceiveAlert] = useState(false);
  const messageRef = useRef();
  // Socket reference so that we deal with the same socket in a particular client instance.
  const chatSocket = useRef(null);
  const nonStateIsOpen = useRef(false);

  // Toggler function to open or close the chat drawer.
  const toggleSlider = () => {
    setIsOpen(!isOpen);
    if (!nonStateIsOpen.current) {
      setMessageReceiveAlert(false);
    }
    nonStateIsOpen.current = !nonStateIsOpen.current;
  };

  useEffect(() => {
    // Initializing the chat socket.
    chatSocket.current = io(
      "http://ec2-3-110-118-192.ap-south-1.compute.amazonaws.com:4000/chat",
      {
        auth: { gameRoomId: gameRoomId.current },
      }
    );

    chatSocket.current.on("connect", () => {});

    // Function whent the chat socket receives a message from the server.
    chatSocket.current.on("receive-message", (message) => {
      displayMessage(message);
    });

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
      setMessageReceiveAlert(true);
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
                autoFocus={true}
              ></input>
              <button id="sendButton">Send</button>
            </div>
          </form>
        </div>
      </div>
      <div
        className={`slider-button ${isOpen ? "open" : ""} ${
          messageReceviedAlert ? "message-alert" : ""
        }`}
        onClick={toggleSlider}
      >
        <img src={chatIcon} className="slider-icon"></img>
      </div>
    </div>
  );
}
