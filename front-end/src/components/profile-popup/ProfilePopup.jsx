import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheckCircle, faUser } from "@fortawesome/free-solid-svg-icons";

const ProfilePopup = ({
  isProfilePopupVisible,
  toggleProfilePopup,
  currentUser,
  handleInvite,
  copiedUserId,
  email,
}) => {
  if (!currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={toggleProfilePopup}
        className={`flex items-center gap-2 border-2 p-2 rounded-full px-4 bg-[#4669ff] text-white  transition-all cursor-pointer ${
          isProfilePopupVisible
            ? "shadow-md"
            : " hover:shadow-md hover:bg-[#405ee8]"
        }`}
      >
        <FontAwesomeIcon icon={faUser} className="mb-1" />
        <span>Profile</span>
      </button>
      {isProfilePopupVisible && (
        <div className="absolute top-12 right-0 bg-white border border-gray-300 shadow-lg p-4 rounded-lg transition-all flex flex-col gap-5">
          <div>
            <p className="text-gray-400 text-sm">Name</p>
            <p className="text-black">{currentUser.username}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-black">{currentUser.email}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Date of Sign Up</p>
            <p className="text-black">
              {(() => {
                const date = new Date(currentUser.createdAt);
                const day = date.getDate().toString().padStart(2, "0");
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              })()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Invite Link</p>
            {currentUser.email === email && (
              <div className="flex-none text-black">
                <button
                  onClick={() => handleInvite(currentUser._id, currentUser.referralLink)}
                >
                  <span className="mr-2">Copy Link</span>
                  {copiedUserId === currentUser._id ? (
                    <FontAwesomeIcon icon={faCheckCircle} color="green" />
                  ) : (
                    <FontAwesomeIcon icon={faCopy} />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePopup;
