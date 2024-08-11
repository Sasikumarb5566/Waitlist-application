import React from "react";

const DeleteAllUsers = () => {
  return (
    <div>
      <button
        className="bg-red-600 text-white p-2 mt-4 rounded-full px-3 md:absolute md:right-52 md:-top-5 text-sm"
        onClick={deleteAllUsers}
      >
        <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
      </button>
    </div>
  );
};

export default DeleteAllUsers;
