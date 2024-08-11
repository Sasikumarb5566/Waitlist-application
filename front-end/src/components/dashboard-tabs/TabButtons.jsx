import React from "react";

const TabButtons = ({ activeTab, setActiveTab }) => (
  <div className="flex border-b border-gray-300 mb-4">
    <button
      className={`px-4 py-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors duration-300 ${
        activeTab === 1 ? "border-b-2 border-blue-600 text-blue-600" : ""
      }`}
      onClick={() => setActiveTab(1)}
    >
      All Users
    </button>
    <button
      className={`px-4 py-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors duration-300 ${
        activeTab === 2 ? "border-b-2 border-blue-600 text-blue-600" : ""
      }`}
      onClick={() => setActiveTab(2)}
    >
      Friends
    </button>
  </div>
);

export default TabButtons;
