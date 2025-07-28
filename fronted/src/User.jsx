import React, { useState, useEffect } from "react";
import "./User.css";

const User = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [synth] = useState(window.speechSynthesis);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => {};
    }
  }, [synth]);

  const startListening = () => {
    if (!recognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (isListening) return;
    setIsListening(true);
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const speakTextWithPauses = (text) => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const voices = synth.getVoices();
    const indianVoice = voices.find(
      (v) => v.lang === "en-IN" || v.name.toLowerCase().includes("india")
    );

    const parts = text.split(/([,.!?])/g).filter(Boolean);
    let index = 0;

    const speakNextPart = () => {
      if (index < parts.length) {
        const part = parts[index].trim();
        if (part) {
          const utterance = new SpeechSynthesisUtterance(part);
          utterance.lang = "en-IN";
          utterance.pitch = 1;
          utterance.rate = 1.7;
          if (indianVoice) utterance.voice = indianVoice;

          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => {
            index++;
            const delay = /[,.!?]/.test(part) ? 200 : 100;
            setTimeout(speakNextPart, delay);
          };

          synth.speak(utterance);
        } else {
          index++;
          speakNextPart();
        }
      } else {
        setIsSpeaking(false);
      }
    };

    speakNextPart();
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStreaming(true);

    let content = "";
    const botMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, botMessage]);

    const eventSource = new EventSource(
      `http://localhost:8089/api/chat/stream?prompt=${encodeURIComponent(
        input
      )}`
    );

    eventSource.onmessage = (event) => {
      content += event.data + " ";
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content,
        };
        return updated;
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
      setStreaming(false);
    };
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        <h2>BharathGPT</h2>
        <button>+ New Chat</button>
        <button>🔍 Search Chats</button>
        <button>📚 Library</button>
        <h3>Recent Queries</h3>
        <ul className="recent-list">
          <li>What is Java?</li>
          <li>Spring Security</li>
          <li>Latest AI Models</li>
        </ul>
      </div>

      <div className="chat-area">
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${
                msg.role === "user" ? "user-message" : "bot-message"
              }`}
            >
              {msg.content}
              {msg.role === "assistant" && (
                <button
                  className="speak-btn"
                  onClick={() => speakTextWithPauses(msg.content)}
                >
                  {isSpeaking ? "⏹️" : "🔊"}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={streaming}
          />
          <button onClick={startListening} disabled={streaming || isListening}>
            {isListening ? "🎙️" : "🎤"}
          </button>
          <button onClick={handleSend} disabled={streaming}>
            {streaming ? "⏳" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
