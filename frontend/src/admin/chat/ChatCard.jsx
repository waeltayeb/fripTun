import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareMore } from 'lucide-react';
import ChatMessage from './ChatMessage';

const chatData = [
  {
    avatar: "UserOne",
    name: 'Devid Heilo',
    text: 'How are you?',
    time: 12,
    textCount: 3,
    color: '#10B981',
  },
  {
    avatar: "UserTwo",
    name: 'Henry Fisher',
    text: 'Waiting for you!',
    time: 12,
    textCount: 0,
    color: '#DC3545',
  },
  {
    avatar: "UserFour",
    name: 'Jhon Doe',
    text: "What's up?",
    time: 32,
    textCount: 0,
    color: '#10B981',
  },
  {
    avatar: "UserFive",
    name: 'Jane Doe',
    text: 'Great',
    time: 32,
    textCount: 2,
    color: '#FFBA00',
  },
  {
    avatar: "UserOne",
    name: 'Jhon Doe',
    text: 'How are you?',
    time: 32,
    textCount: 0,
    color: '#10B981',
  },
  {
    avatar: "UserThree",
    name: 'Jhon Doe',
    text: 'How are you?',
    time: 32,
    textCount: 3,
    color: '#FFBA00',
  },
];

const ChatCard = () => {
  const recentChats = chatData.slice(-5);
  const hasMoreChats = chatData.length > 5;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default xl:col-span-4">
      <div className="flex items-center justify-between mb-6 px-7.5">
        <h4 className="text-xl font-semibold text-black">Chats</h4>
        {hasMoreChats && (
          <Link
            to="/conversations"
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <MessageSquareMore className="w-4 h-4" />
            <span>View All</span>
          </Link>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {recentChats.map((chat, index) => (
          <ChatMessage key={index} {...chat} />
        ))}
      </div>

      {hasMoreChats && (
        <div className="px-7.5 pt-5">
          <Link
            to="/conversations"
            className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors font-medium"
          >
            View All Conversations
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChatCard;