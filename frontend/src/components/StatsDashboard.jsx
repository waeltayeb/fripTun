// StatsDashboard.js
import React from 'react';

export default function StatsDashboard({ statsData }) {
  const { total_profit, total_events, total_user } = statsData[0];


  return (
    <>

      <div className="grid grid-cols-1 w-full gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4 2xl:gap-7">
        <div className="rounded-lg border-0 border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="flex items-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="text-blue-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 20H3V4H7V20ZM21 20H17V10H21V20ZM14 20H10V14H14V20Z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-800">{total_profit}</h4>
              <p className="text-sm text-gray-500">Total Profit</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border-0 border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="flex items-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="text-blue-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 4V6H19V4H5ZM3 8V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V8H3ZM5 20V10H19V20H5ZM9 12H11V18H9V12ZM13 12H15V18H13V12Z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-800">{total_events}</h4>
              <p className="text-sm text-gray-500">Total Events</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border-0 border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="flex items-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="text-blue-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-800">{total_user}</h4>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
      </div>

    </>


  );
}
