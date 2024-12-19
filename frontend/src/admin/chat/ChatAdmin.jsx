import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Update with your backend URL

const ChatAdmin = () => {
  const [activeUser, setActiveUser] = useState(null); // Active user state
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [messages, setMessages] = useState([]); // Messages state
  const [newMessage, setNewMessage] = useState(""); // Input field state
  const [users, setUsers] = useState([]); // Users state
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null); // To scroll to the bottom of the chat

  // Fetch user list from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/chat/users");
        setUsers(response.data);
        setIsLoadingUsers(false);
      } catch (error) {
        setError("Failed to fetch users");
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();

    // Listen for real-time updates from the server
    socket.on("receiveMessage", (message) => {
      if (message.userId === activeUser?._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [activeUser]);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch messages for the selected user
  const selectUser = async (user) => {
    setActiveUser(user);
    setIsLoadingMessages(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/messages/${user._id}`
      );
      setMessages(response.data);
      setIsLoadingMessages(false);
      scrollToBottom();
    } catch (error) {
      setError("Failed to fetch messages");
      setIsLoadingMessages(false);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      sender: "admin", // Ensure this is correct
      text: newMessage, // The message content
      userId: activeUser._id, // The recipient's user ID
    };

    try {
      // Send the message to the backend
      const response = await axios.post("http://localhost:5000/api/chat/send", messageData);

      // Optimistically add the message to the UI
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
      scrollToBottom();

      // Emit the new message via socket
      socket.emit("newMessage", response.data);
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row justify-between bg-white">
        {/* User List */}
        <div className="flex flex-col w-full md:w-2/5 border-b-2 md:border-r-2 md:border-b-0 h-[400px] md:h-[500px] overflow-y-auto">
          {/* Search */}
          <div className="border-b-2 py-4 px-2">
            <input
              type="text"
              placeholder="Search chatting"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
            />
          </div>

          {/* User List */}
          {isLoadingUsers ? (
            <div className="text-center py-5 text-gray-500">Loading users...</div>
          ) : error ? (
            <div className="text-center py-5 text-red-500">{error}</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => selectUser(user)}
                className={`flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer hover:bg-gray-100 transition ${
                  activeUser?._id === user._id ? "border-l-4 border-blue-400" : ""
                }`}
              >
                <div className="w-1/4">
                  <img
                    src={user.avatar}
                    className="object-cover h-12 w-12 rounded-full"
                    alt={user.firstname}
                  />
                </div>
                <div className="w-full">
                  <div className="text-lg font-semibold">{user.firstname}</div>
                  <span className="text-gray-500">{user.lastMessage}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-gray-500">No users found</div>
          )}
        </div>

        {/* Messages Section */}
        <div className="w-full md:w-3/5 px-5 flex flex-col justify-between">
          {/* Header */}
          <div className="py-4 border-b">
            {activeUser ? (
              <div className="text-lg font-semibold">
                Chat with {activeUser.firstname}
              </div>
            ) : (
              <div className="text-lg text-gray-500">Select a user to chat</div>
            )}
          </div>

          {/* Messages */}
          <div className="flex flex-col mt-5 h-[400px] md:h-[500px] overflow-y-auto">
            {isLoadingMessages ? (
              <div className="text-center text-gray-500">Loading messages...</div>
            ) : activeUser && messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "admin" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  {message.sender !== "admin" && (
                    <img
                      src={activeUser.avatar}
                      className="object-cover h-8 w-8 rounded-full"
                      alt={activeUser.firstname}
                    />
                  )}
                  <div
                    className={`${
                      message.sender === "admin"
                        ? "mr-2 py-3 px-4 bg-blue-400 text-white"
                        : "ml-2 py-3 px-4 bg-gray-400 text-white"
                    } rounded-bl-3xl rounded-tl-3xl rounded-tr-xl`}
                  >
                    {message.text}
                  </div>
                  {message.sender === "admin" && (
                    <img
                      src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                      className="object-cover h-8 w-8 rounded-full"
                      alt="Admin"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center mt-5">
                No conversation selected
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          {activeUser && (
            <div className="py-5 flex">
              <input
                className="w-full bg-gray-300 py-5 px-3 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-xl hover:bg-blue-600 transition duration-300"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;
