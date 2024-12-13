import React, { useState, useRef } from "react";

const Chatbox = () => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false); // State to toggle chatbox visibility
  const [messages, setMessages] = useState([
    { text: "Hello", sender: "user" },
    { text: "This is a response from the chatbot.", sender: "bot" },
    { text: "This is an example of chat.", sender: "user" },
    { text: "This is a response from the chatbot.", sender: "bot" },
    { text: "Designed with Tailwind.", sender: "user" },
    { text: "This is a response from the chatbot.", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");
  const chatboxRef = useRef(null);

  // Function to toggle chatbox visibility
  const toggleChatbox = () => {
    setIsChatboxOpen((prev) => !prev);
  };

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    setMessages((prev) => [...prev, { text: userInput, sender: "user" }]);
    setUserInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "This is a response from the chatbot.", sender: "bot" },
      ]);
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    }, 500);
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
              <p className="text-lg font-semibold">Admin Bot</p>
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
            <div
              ref={chatboxRef}
              className="p-4 h-80 overflow-y-auto"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    message.sender === "user" ? "text-right" : ""
                  }`}
                >
                  <p
                    className={`py-2 px-4 inline-block rounded-lg ${
                      message.sender === "user"
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
