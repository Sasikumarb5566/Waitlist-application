import React from "react";

const SearchBar = ({ searchTerm, handleChange }) => (
  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden mb-4">
    <input
      type="text"
      value={searchTerm}
      onChange={handleChange}
      placeholder="Search..."
      className="px-4 py-2 w-full outline-none"
    />
  </div>
);

export default SearchBar;
