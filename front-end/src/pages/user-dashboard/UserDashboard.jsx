import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfilePopup from "../../components/profile-popup/ProfilePopup";
import AllUser from "../../components/user-view/AllUser";
import Friends from "../../components/user-view/Friends";
import TabButtons from "../../components/dashboard-tabs/TabButtons";
import SearchBar from "../../layout/search-bar/SeachBar";
import { fetchAllUsers } from "../../services/user-services/UserServices";

const UserDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const { email } = location.state || {};
  const [referrals, setReferrals] = useState([]);
  const [isProfilePopupVisible, setProfilePopupVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [copiedUserId, setCopiedUserId] = useState(null);
  const navigate = useNavigate();

  const toggleProfilePopup = () => {
    setProfilePopupVisible(!isProfilePopupVisible);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInvite = (userId, invite) => {
    const inviteLink =
      import.meta.env.VITE_USER_FRONTEND_BASE_URL +
      `/signup/?inviter=${invite}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopiedUserId(userId);
        setTimeout(() => setCopiedUserId(null), 2000);
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchAllUsers();
        const usersData = response.data;

        if (!usersData.success) {
          console.log(usersData.message);
          return;
        }

        const sortedUsers = usersData.data.sort((a, b) => {
          if (a.email === email) return -1;
          if (b.email === email) return 1;
          return a.position - b.position;
        });

        setUsers(sortedUsers);

        if (email) {
          const currentUser = sortedUsers.find((user) => user.email === email);
          if (currentUser) {
            setCurrentUser(currentUser);
            const friends = sortedUsers.filter(
              (user) => user.inviter === currentUser.referralLink
            );
            setReferrals(friends);
          }
        }
      } catch (error) {
        console.log("Error in fetching all users: ", error);
      }
    };

    if (email) {
      fetchUsers();
    }
  }, [email]);

  if (!email) {
    return (
      <div className="bg-[#ecf0fe] flex flex-col gap-2 items-center justify-center min-h-screen ">
        <div className="flex items-center gap-4 mb-6">
          <img src="src/assets/images/login.png" alt="login" className="w-28" />
          <div className="font-bold text-5xl">Go back...</div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-[#4669ff] hover:bg-[#435dcf] text-white p-2 px-12 rounded-xl"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#ecf0fe] min-h-screen flex flex-col items-center justify-center relative">
      <div className="absolute top-5 right-5">
        <ProfilePopup
          isProfilePopupVisible={isProfilePopupVisible}
          toggleProfilePopup={toggleProfilePopup}
          currentUser={currentUser}
          handleInvite={handleInvite}
          copiedUserId={copiedUserId}
          email={email}
        />
      </div>
      <div className="container mx-auto py-8 flex flex-col items-center">
        <div className="md:max-w-lg w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-6 text-left">Dashboard</h1>
          <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
          <SearchBar searchTerm={searchTerm} handleChange={handleChange} />
          {activeTab === 1 ? (
            <AllUser users={users} searchTerm={searchTerm} email={email} />
          ) : (
            <Friends users={referrals} searchTerm={searchTerm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
