import React, { useState } from "react";
import "./ChatSupport.css";

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hallo! Wie kann ich Ihnen helfen?" }
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    const userMessage = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    // Simple bot response (echo for demo)
    const botResponse = { from: "bot", text: "Sie sagten: " + input.trim() };
    setMessages((prev) => [...prev, botResponse]);

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chat-support ${isOpen ? "open" : ""}`}>
      {!isOpen && (
        <button className="chat-icon" onClick={toggleChat} aria-label="Chat öffnen">
          💬
        </button>
      )}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Support Chat</span>
            <button className="close-btn" onClick={toggleChat} aria-label="Chat schließen">×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.from === "bot" ? "bot" : "user"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Schreiben Sie eine Nachricht..."
              rows={2}
            />
            <button onClick={handleSend} aria-label="Nachricht senden">Senden</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;
