import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Update with your server URL

const Chatbox = ({ clientId }) => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatboxRef = useRef(null);

  useEffect(() => {
    // Listen for real-time new messages - moved outside isChatboxOpen
    socket.on("receiveMessage", (message) => {
      if (message.userId === clientId) {
        setMessages((prev) => {
          // Check if message already exists (by tempId or content)
          const messageExists = prev.some((m) =>
            (m.tempId && m.tempId === message.tempId) ||
            (m.text === message.text && m.timestamp === message.timestamp)
          );
          if (!messageExists) {
            return [...prev, message];
          }
          return prev;
        });
        scrollToBottom();
      }
    });

    // Listen for message errors
    socket.on("messageError", (error) => {
      console.error("Message error:", error);
      // You could show an error notification to the user here
    });

    // Cleanup socket listener when component unmounts
    return () => {
      socket.off("receiveMessage");
      socket.off("messageError");
    };
  }, [clientId]); // Only depend on clientId

  useEffect(() => {
    if (isChatboxOpen) {
      // Fetch chat history for the client
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/chat/messages/${clientId}`
          );
          setMessages(response.data);
          scrollToBottom();
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };

      fetchMessages();
    }
  }, [isChatboxOpen, clientId]);

  // Scroll to the bottom of the chatbox
  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  const toggleChatbox = () => {
    setIsChatboxOpen((prev) => !prev);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    const messageData = {
      sender: "client",
      text: userInput,
      userId: clientId,
      timestamp: new Date().toISOString(),
    };

    try {
      // Clear input immediately for better UX
      setUserInput("");
      
      // Emit through socket for instant display
      socket.emit("newMessage", messageData);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div>
      {/* Chat Button */}
      <div className="fixed bottom-0 right-0 mb-4 mr-4">
        <button
          onClick={toggleChatbox}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Chat
        </button>
      </div>

      {/* Chat Container */}
      {isChatboxOpen && (
        <div className="fixed bottom-16 right-4 w-96">
          <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
            {/* Header */}
            <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
              <p className="text-lg font-semibold">Chat</p>
              <button
                onClick={toggleChatbox}
                className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chatbox */}
            <div ref={chatboxRef} className="p-4 h-80 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    message.sender === "client" ? "text-right" : "text-left"
                  }`}
                >
                  <p
                    className={`py-2 px-4 inline-block rounded-lg ${
                      message.sender === "client"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex">
              <input
                type="text"
                placeholder="Type a message"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;