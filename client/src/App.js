import './App.css';
import io from "socket.io-client";
import React, { useState, useEffect } from "react";

const socket = io("http://localhost:4000");

function App() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Me"
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    const reciveMessage = (message) => {
      setMessages([...messages, message]);
    }

    socket.on("message", reciveMessage);

    return () => {
      socket.off("message", reciveMessage);
    };
  }, [messages]);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={e => setMessage(e.target.value)}
          value={message}
        />
        <button>send</button>
      </form>
      {messages.map((message, index) => (
        <div key={index}>
          <p>{message.from}: {message.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
