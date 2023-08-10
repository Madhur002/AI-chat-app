import React, { useState, useEffect } from "react";
import socket from "./socket";
import "./App.css";
import { IoSendSharp, IoMoon, IoSunnySharp } from "react-icons/io5";
import { TbReload } from "react-icons/tb";
// import robotImage from "./images/robo.jpg";
import { format } from "date-fns";
import { useUser } from "@clerk/clerk-react";
import { BsClipboard } from "react-icons/bs";
import cogoToast from "cogo-toast";
import 'animate.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState("...");
  const [mode, setMode] = useState(false);

  useEffect(() => {
    const handleMessage = (message) => {
      const currentTime = getCurrentTime(); // Get the current time
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, time: currentTime },
      ]);
      setLoading(false);
      setLoadingDots(""); // Clear loading dots when a new message arrives
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const getCurrentTime = () => {
    return format(new Date(), "HH:mm"); // Format the current time as "hour:minute"
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const currentTime = getCurrentTime(); // Get the current time
      socket.emit("userMessage", { text: inputMessage, time: currentTime });
      setMessages([
        ...messages,
        { text: inputMessage, fromUser: true, time: currentTime },
      ]);
      setInputMessage("");
      setLoading(true);
      setLoadingDots(""); // Clear loading dots when a new message is sent
    }
  };

  const emptyMessage = () => {
    setMessages([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (loading) {
      const intervalId = setInterval(() => {
        setLoadingDots((prevDots) =>
          prevDots.length < 3 ? prevDots + "." : ""
        );
      }, 500);

      return () => clearInterval(intervalId);
    }
  }, [loading]);

  // ... (existing functions and JSX)

  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const modeToggler = () => {
    setMode(!mode);
  }

  const copyToClipboard = (text) => {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    cogoToast.success("Copied to clipboard successfully !", { hideAfter: "1" });
  };

  const renderMessageContent = (text) => {
    const codeRegex = /```([\s\S]*?)```/g; // Regex to match code blocks
    const codeMatches = text.match(codeRegex);

    if (codeMatches) {
      // If there are code blocks, split the text and render accordingly
      const nonCodeParts = text.split(codeRegex);
      return nonCodeParts.map((part, index) => {
        if (index % 2 === 0) {
          // Even indexes are non-code parts
          return <span key={index}>{part}</span>;
        } else {
          // Odd indexes are code blocks
          const codeText = codeMatches[(index - 1) / 2].replace(/```/g, '');
          return (
            <pre key={index} className="code-block">
              <code>{codeText}</code>
            </pre>
          );
        }
      });
    } else {
      // If no code blocks, simply render the plain text
      return <span>{text}</span>;
    }
  };

  return (
    <div className="chat-container">
      <div className={`${mode === true ? "message-container-dark" : "message-container"}`}>
        <div onClick={modeToggler} className="toggler rotate-center">
         { mode === false ? (<div className=""><IoSunnySharp/></div>): (<div className=""><IoMoon/></div>)}
        </div>
        {messages.length === 0 ? (
          // Initial message
          <div className="blank-div">
            <p>Hi {user.firstName} 👋🏻 I'm your Ai Todo Creator</p>
            <p>Ask me to create one for you!</p>
          </div>
        ) : (
          <>
            {/* Display messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.fromUser ? "user" : "bot"}`}
              >
                <div style={{maxWidth: "100%"}}>
                  <div >
                  {renderMessageContent(message.text)}
                    <br />
                    <p
                      className={`${
                        message.fromUser ? "message-time" : "message-time-bot"
                      }`}
                    >
                      {message.time}
                      {`${Math.round(message.time) <= 12 ? " AM" : " PM"}`}
                    </p>{" "}
                    {/* Display the formatted time */}
                  </div>
                </div>
                <div className="copy-div">
                  {!message.fromUser && ( // Only show the copy button for bot messages
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(message.text)}
                    >
                      <BsClipboard />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="loading message bot">{loadingDots}</div>
            )}
          </>
        )}
      </div>

      <div className="input-container">
        <div className="input-sub-container">
          <input
            onKeyDown={handleKeyDown}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button className="btn-reload" onClick={emptyMessage}>
            <TbReload />
          </button>
        </div>
        <button className="btn-send" onClick={sendMessage}>
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
}

export default Chat;
