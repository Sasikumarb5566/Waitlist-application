import React from "react";

const AddUser = () => {
  return (
    <div>
      <button
        onClick={() => setIsFormVisible(true)}
        className="bg-green-600 text-white p-2 mt-4 rounded-full px-3 md:absolute md:right-0 md:-top-5 text-sm"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add user
      </button>
    </div>
  );
};

export default AddUser;
