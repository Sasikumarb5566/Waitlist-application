import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FilterUsers } from "../../utils/filter-user/FilterUsers";

const AllUser = ({ users, searchTerm, email }) => {
  const filteredUsers = FilterUsers(users, searchTerm);
  return (
    <ul>
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <li key={user._id} className="my-2">
            <div
              className={`p-4 rounded-lg flex items-center justify-between shadow-lg ${
                user.email === email
                  ? "bg-[#4669ff] text-white"
                  : "bg-white text-black"
              }`}
            >
              <div className="flex-1">
                <div>{user.position}</div>
              </div>
              <div className="flex-1 text-center">
                <div>{user.username}</div>
              </div>
              <div className="flex-1 text-right">
                <div>
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  {user.referrals}
                </div>
              </div>
            </div>
          </li>
        ))
      ) : (
        <p>No users found</p>
      )}
    </ul>
  );
};

export default AllUser;
