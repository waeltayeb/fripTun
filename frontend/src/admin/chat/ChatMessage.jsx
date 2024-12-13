import React from 'react';
import { Link } from 'react-router-dom';

const ChatMessage = ({ avatar, name, text, time, textCount, color }) => (
  <Link
    to="/chat"
    className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-50 transition-colors"
  >
    <div className="relative h-14 w-14 rounded-full">
      <img src={avatar} alt={name} className="rounded-full" />
      <span
        className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white"
        style={{ backgroundColor: color }}
      />
    </div>

    <div className="flex flex-1 items-center justify-between">
      <div>
        <h5 className="font-medium text-black">{name}</h5>
        <p>
          <span className="text-sm text-black">{text}</span>
          <span className="text-xs text-gray-500"> · {time} min</span>
        </p>
      </div>
      {textCount > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
          <span className="text-sm font-medium text-white">{textCount}</span>
        </div>
      )}
    </div>
  </Link>
);

export default ChatMessage;
