import React from 'react'

export default function EventForm() {
    return (

        <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 md:flex-row">
                <div className="w-full">
                    <div className="input-field">
                        <input
                            type="text"
                            placeholder="Event title"
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div className="input-field">
                        <select
                            className="w-full border rounded-lg p-3"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select event type
                            </option>
                            {/* Dropdown options */}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5 md:flex-row">
                <div className="w-full">
                    <div className="input-field">
                        <textarea
                            placeholder="Description"
                            className="w-full border rounded-lg p-3 h-40"
                            required
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div className="input-field">
                        <input
                            type="file"
                            className="w-full border rounded-lg p-3"
                            accept="image/*"
                        />
                    </div>
                    <div className="flex items-center h-14 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 mt-3 lg:mt-10">
                        <img src="/img/icons/link.svg" alt="link" className="w-6 h-6 mr-2" />
                        <input
                            type="url"
                            placeholder="URL"
                            className="flex-1 border-none rounded-lg p-2 bg-gray-50 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5 md:flex-row">
                <div className="w-full">
                    <div className="flex items-center h-14 w-full rounded-lg border border-gray-300 bg-gray-50 px-4">
                        <img src="/img/icons/location-grey.svg" alt="location" className="w-6 h-6 mr-2" />
                        <input
                            type="text"
                            placeholder="Event location or Online"
                            className="flex-1 border-none rounded-lg p-2 bg-gray-50 outline-none"
                            min="0"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5 md:flex-row">
                <div className="w-full">
                    <div className="flex items-center h-14 w-full rounded-full bg-gray-50 px-4">
                        <img src="/img/icons/calendar.svg" alt="start date" className="w-6 h-6 mr-2" />
                        <label className="text-gray-600 mr-2">Start Date:</label>
                        <input
                            type="datetime-local"
                            className="flex-1  bg-gray-50 outline-none border rounded-lg p-3"
                            required
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex items-center h-14 w-full rounded-full bg-gray-50 px-4">
                        <img src="/img/icons/calendar.svg" alt="end date" className="w-6 h-6 mr-2" />
                        <label className="text-gray-600 mr-2">End Date:</label>
                        <input
                            type="datetime-local"
                            className="flex-1 border rounded-lg p-3 bg-gray-50 outline-none"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5 md:flex-row">
                <div className="w-full">
                    <div className="flex items-center h-14 w-full rounded-lg border border-gray-300 bg-gray-50 px-4">
                        <img src="/img/icons/dollar.svg" alt="price" className="w-6 h-6 mr-2" />
                        <input
                            type="number"
                            placeholder="Price"
                            className="flex-1 border-none rounded-lg p-2 bg-gray-50 outline-none"
                            min="0"
                        />
                        <label className="ml-2 lg:ml-3 flex items-center bg-green-500 p-3 h-11  rounded-lg text-white hover:bg-green-600">
                            Free Ticket
                            <input type="checkbox" className="ml-2  " />
                        </label>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex items-center h-14 w-full rounded-lg border border-gray-300 bg-gray-50 px-4">
                        <img src="/img/icons/ticket.svg" alt="ticket" className="w-6 h-6 mr-2" />
                        <input
                            type="number"
                            placeholder="Number of tickets"
                            className="flex-1 border-none rounded-lg p-2 bg-gray-50 outline-none"
                            min="0"
                        />
                    </div>
                </div>
                
            </div>


            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg mt-5 hover:bg-blue-600 transition duration-200"
            >
                Submit Event
            </button>
        </form>


    )
}
