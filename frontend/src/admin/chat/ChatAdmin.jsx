import React from "react";

const ChatAdmin = () => {
  return (
    <div className="container mx-auto shadow-lg rounded-lg">
      {/* Chatting Section */}
      <div className="flex flex-col md:flex-row justify-between bg-white">
        {/* Chat List */}
        <div className="flex flex-col w-full md:w-2/5 border-b-2 md:border-r-2 md:border-b-0 h-[400px] md:h-[500px] overflow-y-auto">
          {/* Search */}
          <div className="border-b-2 py-4 px-2">
            <input
              type="text"
              placeholder="search chatting"
              className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
            />
          </div>
          {/* End Search */}

          {/* User List */}
          {Array(20)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={`flex flex-row py-4 px-2 items-center border-b-2 ${
                  index === 2 ? "border-l-4 border-blue-400" : ""
                }`}
              >
                <div className="w-1/4">
                  <img
                    src={`https://source.unsplash.com/random/600x600?sig=${index}`}
                    className="object-cover h-12 w-12 rounded-full"
                    alt=""
                  />
                </div>
                <div className="w-full">
                  <div className="text-lg font-semibold">User {index + 1}</div>
                  <span className="text-gray-500">Last message...</span>
                </div>
              </div>
            ))}
          {/* End User List */}
        </div>
        {/* End Chat List */}

        {/* Messages Section */}
        <div className="w-full md:w-3/5 px-5 flex flex-col justify-between">
          {/* Scrollable Messages */}
          <div className="flex flex-col mt-5 h-[400px] md:h-[500px] overflow-y-auto">
            {[...Array(20).keys()].map((_, index) => (
              <div
                key={index}
                className={`flex ${
                  index % 2 === 0 ? "justify-end" : "justify-start"
                } mb-4`}
              >
                {index % 2 !== 0 && (
                  <img
                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                  />
                )}
                <div
                  className={`${
                    index % 2 === 0
                      ? "mr-2 py-3 px-4 bg-blue-400 text-white"
                      : "ml-2 py-3 px-4 bg-gray-400 text-white"
                  } rounded-bl-3xl rounded-tl-3xl rounded-tr-xl`}
                >
                  Message {index + 1}
                </div>
                {index % 2 === 0 && (
                  <img
                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
          {/* End Scrollable Messages */}

          {/* Message Input */}
          <div className="py-5">
            <input
              className="w-full bg-gray-300 py-5 px-3 rounded-xl"
              type="text"
              placeholder="type your message here..."
            />
          </div>
        </div>
        {/* End Messages Section */}
      </div>
    </div>
  );
};

export default ChatAdmin;
