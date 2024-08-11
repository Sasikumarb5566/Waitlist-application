import React, { useState, useEffect } from 'react';
import NotificationBar from "../../components/notification-bar/NotificationBar";
import { fetchAllUsers } from '../../services/user-services/UserServices';
import * as XLSX from 'xlsx';
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { adminUserAdd, deleteAllUser, deleteSingleUser, saveUser } from '../../services/admin-services/AdminServices';
import {
  faTrashAlt,
  faCopy,
  faCheckCircle,
  faEdit,
  faSave,
  faPlus,
  faFileExport,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { email } = location.state || {};
  const [copied, setCopied] = useState({});
  const [editMode, setEditMode] = useState({});
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const [addUser, setAddUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const filterUsers = (list, searchTerm) => {
    if (!Array.isArray(list)) {
      console.error('Expected an array for the list parameter.');
      return [];
    }
  
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
    return list.filter((user) => {
      if (!user) {
        console.warn('Encountered an undefined or null user object.');
        return false;
      }
  
      const username = user.username || "";
      const userPosition = user.position !== undefined ? String(user.position) : "";
      const userReferrals = user.referrals !== undefined ? String(user.referrals) : "";
  
      return (
        username.toLowerCase().includes(lowerCaseSearchTerm) ||
        userPosition.includes(lowerCaseSearchTerm) ||
        userReferrals.includes(lowerCaseSearchTerm)
      );
    });
  };
  
  const filteredUsers = filterUsers(users, searchTerm);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState({});
  const [updatedPosition, setUpdatedPosition] = useState({});
  const [updatedReferrals, setUpdatedReferrals] = useState({});

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(
      () => setNotification({ ...notification, visible: false }),
      5000
    );
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };
  
  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };



  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const deleteAllUsers = async () => {
    try {
      const response = await deleteAllUser();
      const user = response.data;
      if (!user.success) {
        showNotification(user.message, "error");
        return;
      }
      showNotification("Successfully deleted all users", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDelete = async(userId) => {
    try {
      const response = await deleteSingleUser(userId);
      const user = response.data;
      if(!user.success) {
        showNotification(user.message, "error");
        return;
      }
      showNotification(user.message, "success");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    }
    catch(error) {
      console.log("Error in deleting single user", "error")
    }
  }

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
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    if (email) {
      fetchUsers();
    }
  }, [email]);
  

  if (!email) {
    return (
      <div className="bg-[#ecf0fe] flex flex-col gap-2 items-center justify-center min-h-screen text-center">
        <div className="text-2xl font-semibold">
          <div className='flex flex-col items-center gap-4'><img src="src/assets/images/warning.png" alt="warning" className='w-24' /><span className='text-5xl font-bold'>Warning !</span></div>
          <div className='mt-4'>You're not allowed to access the Admin page.</div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await adminUserAdd(addUser);
    const user = response.data;
    if (!user.success) {
      showNotification(user.message, "error");
      return;
    }
    showNotification(user.message, "success");
  }

  const handleEdit = (userId, username, position, referrals) => {
    setEditMode((prevState) => ({ ...prevState, [userId]: true }));
    setUpdatedName((prevState) => ({ ...prevState, [userId]: username }));
    setUpdatedPosition((prevState) => ({ ...prevState, [userId]: position }));
    setUpdatedReferrals((prevState) => ({ ...prevState, [userId]: referrals }));
  };

  const handleInvite = (userId, referralLink) => {
    const inviteLink = `http://localhost:5050/signup/?inviter=${referralLink}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied((prevState) => ({ ...prevState, [userId]: true }));
        setTimeout(
          () => setCopied((prevState) => ({ ...prevState, [userId]: false })),
          2000
        );
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  const handlePositionChange = (userId, newPosition) => {
    setUpdatedPosition((prevState) => ({
      ...prevState,
      [userId]: newPosition,
    }));
  };

  const handleReferralsChange = (userId, newReferrals) => {
    setUpdatedReferrals((prevState) => ({
      ...prevState,
      [userId]: newReferrals,
    }));
  };
  const handleNameChange = (userId, newName) => {
    setUpdatedName((prevState) => ({ ...prevState, [userId]: newName }));
  };

  const handleSave = async (userId) => {
    try {
      const updatedData = {
        username: updatedName[userId] ?? users.find(user => user._id === userId).username,
        position: updatedPosition[userId] ?? users.find(user => user._id === userId).position,
        referrals: updatedReferrals[userId] ?? users.find(user => user._id === userId).referrals,
      };
  
      const response = await saveUser(userId, updatedData);
      const updatedUser = response.data.data;
  
      if (!response.data.success) {
        showNotification(response.data.message, "error");
        return;
      }

      setUsers(prevUsers => 
        prevUsers.map(user =>
          user._id === userId ? { ...user, ...updatedUser } : user
        )
      );
  
      setEditMode(prevState => ({ ...prevState, [userId]: false }));
      showNotification("User updated successfully. Refresh...", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification("Error updating user", "error");
    }
  };
  
  return (
    <div className="bg-[#ecf0fe] flex items-center justify-center min-h-screen relative">
      {notification.visible && (
        <NotificationBar
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      {isFormVisible && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Add New User
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={addUser.username}
                onChange={(e) =>
                  setAddUser({ ...addUser, username: e.target.value })
                }
                required
                className="border-2 w-full p-3 rounded-full mb-4"
              />
              <input
                type="email"
                placeholder="abc@gmail.com"
                name="email"
                required
                value={addUser.email}
                onChange={(e) =>
                  setAddUser({ ...addUser, email: e.target.value })
                }
                className="border-2 w-full p-3 rounded-full mb-4"
              />
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                required
                value={addUser.password}
                onChange={(e) =>
                  setAddUser({ ...addUser, password: e.target.value })
                }
                className="border-2 w-full p-3 rounded-full mb-4"
              />
              <button
                type="submit"
                className="bg-[#4669ff] p-3 rounded-full text-white w-full hover:bg-[#3853cc] transition-all"
              >
                Add user
              </button>
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="mt-4 w-full text-center text-red-500"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <div
        className={`p-8 rounded-3xl shadow-xl md:max-w-2xl w-full max-w-sm text-black ${
          isFormVisible ? "blur-sm" : ""
        }`}
      >
        <div className="md:flex md:relative md:flex-row ">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <div>
              <button
                onClick={() => setIsFormVisible(true)}
                className="bg-green-600 text-white p-2 mt-4 rounded-full px-3 md:absolute md:right-0 md:-top-5 text-sm"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add user
              </button>
            </div>
            <div>
              <button
                className="bg-blue-600 text-white p-2 mt-4 rounded-full px-3 md:absolute md:right-28 md:-top-5 text-sm"
                onClick={() => exportToExcel(users)} 
              >
                <FontAwesomeIcon icon={faFileExport} className="mr-1" /> Export
              </button>
            </div>
            <div>
              <button
                className="bg-red-600 text-white p-2 mt-4 rounded-full px-3 md:absolute md:right-52 md:-top-5 text-sm"
                onClick={deleteAllUsers}
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden mt-3">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Search..."
            className="px-4 py-2 w-full outline-none"
          />
        </div>
        <div className="my-3">
          <ul>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li key={user._id} className="my-2">
                  <div className="p-4 rounded-lg flex bg-white opacity-90 text-black shadow-xl mb-3">
                    <div className="w-1/3 text-left flex items-center">
                      {editMode[user._id] ? (
                        <input
                          type="number"
                          value={updatedPosition[user._id] ?? user.position}
                          onChange={(e) =>
                            handlePositionChange(user._id, e.target.value)
                          }
                          className="bg-transparent text-black w-full"
                          style={{ maxWidth: "80px" }}
                        />
                      ) : (
                        <div>{user.position}</div>
                      )}
                    </div>
                    <div className="md:w-1/3 w-2/3 text-center flex items-center">
                      {editMode[user._id] ? (
                        <input
                          type="text"
                          value={updatedName[user._id] ?? user.username}
                          onChange={(e) =>
                            handleNameChange(user._id, e.target.value)
                          }
                          className="bg-transparent text-black w-full"
                          placeholder={user.username}
                          style={{ minWidth: "100px" }} 
                        />
                      ) : (
                        <div>{user.username}</div>
                      )}
                    </div>

                    <div className="w-1/3 text-center flex items-center">
                      {editMode[user._id] ? (
                        <input
                          type="text"
                          value={updatedReferrals[user._id] ?? user.referrals}
                          onChange={(e) =>
                            handleReferralsChange(user._id, e.target.value)
                          }
                          className="bg-transparent text-black w-full"
                          placeholder={user.referrals}
                          style={{ maxWidth: "45px" }} 
                        />
                      ) : (
                        <div>{user.referrals}</div>
                      )}
                    </div>

                    <div className="w-1/3 text-right flex items-center justify-end md:gap-4 gap-2">
                      <button
                        onClick={() =>
                          handleInvite(user._id, user.referralLink)
                        }
                        className="p-2"
                      >
                        {copied[user._id] ? (
                          <FontAwesomeIcon icon={faCheckCircle} color="green" />
                        ) : (
                          <FontAwesomeIcon icon={faCopy} />
                        )}
                      </button>
                      {editMode[user._id] ? (
                        <button
                          onClick={() => handleSave(user._id)}
                          className="p-2"
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(user._id, user.username)}
                          className="p-2"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 p-2"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>No users found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;