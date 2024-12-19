import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareMore } from 'lucide-react';
import axios from 'axios';
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatCard = () => {
  const [lastMessages, setLastMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch last messages
  const fetchLastMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chat/users/last-messages");
      setLastMessages(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching last messages:", err);
      setError("Failed to load messages");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastMessages();

    // Listen for new messages
    socket.on("receiveMessage", () => {
      // Refresh the last messages when a new message is received
      fetchLastMessages();
    });

    // Set up auto-refresh
    const interval = setInterval(fetchLastMessages, 30000); // Refresh every 30 seconds

    return () => {
      socket.off("receiveMessage");
      clearInterval(interval);
    };
  }, []);

  // Get the 5 most recent messages
  const recentChats = lastMessages.slice(0, 5);
  const hasMoreChats = lastMessages.length > 1;

  // Function to format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // If less than 24 hours, show time
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If less than 7 days, show day
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default xl:col-span-4">
      <div className="flex items-center justify-between mb-6 px-7.5">
        <h4 className="text-xl font-semibold text-black">Chats</h4>
        {hasMoreChats && (
          <Link
            to="/Conversations"
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <MessageSquareMore className="w-4 h-4" />
            <span>View All</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {recentChats.map((chat) => (
            <div
              key={chat.userId}
              className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-50 cursor-pointer"
              onClick={() => window.location.href = '/Conversations'}
            >
              <div className="relative h-12 w-12 rounded-full">
                <img
                  src="https://res.cloudinary.com/dy7sxgoty/image/upload/v1734643097/clients_lpqouh.png"
                  alt={chat.userName}
                  className="h-full w-full rounded-full object-cover object-center"
                />
                <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></span>
              </div>

              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium text-black">{chat.userName}</h5>
                  <p className="text-sm text-gray-600">
                    {chat.message.length > 30 
                      ? chat.message.substring(0, 30) + "..."
                      : chat.message}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400">
                    {formatTime(chat.timestamp)}
                  </span>
                  {chat.sender === 'client' && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                      1
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {recentChats.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No recent messages
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatCard;