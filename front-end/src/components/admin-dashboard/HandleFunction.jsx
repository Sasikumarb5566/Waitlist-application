import {
  deleteAllUser,
  deleteSingleUser,
  saveUser
} from "../../services/admin-services/AdminServices";
import * as XLSX from "xlsx";

export const handleEdit = (
  userId,
  username,
  position,
  referrals,
  setEditMode,
  setUpdatedName,
  setUpdatedPosition,
  setUpdatedReferrals
) => {
  setEditMode((prevState) => ({ ...prevState, [userId]: true }));
  setUpdatedName((prevState) => ({ ...prevState, [userId]: username }));
  setUpdatedPosition((prevState) => ({ ...prevState, [userId]: position }));
  setUpdatedReferrals((prevState) => ({ ...prevState, [userId]: referrals }));
};

export const deleteAllUsers = async (showNotification) => {
  try {
    const response = await deleteAllUser();
    const user = response.data;
    if (!user.success) {
      showNotification(user.message, "error");
    } else {
      showNotification("Successfully deleted all users", "success");
    }
  } catch (error) {
    console.error("Error deleting all users:", error);
    showNotification("Error deleting users", "error");
  }
};

export const exportToExcel = async (users) => {
  const worksheet = XLSX.utils.json_to_sheet(users);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  XLSX.writeFile(workbook, "users_data.xlsx");
};

export const deleteUser = async (userId, showNotification, setUsers) => {
  try {
    const response = await deleteSingleUser(userId);
    const user = response.data;
    if (!user.success) {
      showNotification(user.message, "error");
      return;
    }
    showNotification(user.message, "success");
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  } catch (error) {
    console.error("Error deleting single user", error);
    showNotification("Error deleting user", "error");
  }
};

export const saveUsers = async (
    userId,
    updatedName,
    updatedPosition,
    updatedReferrals,
    users,
    setUsers,
    setEditMode,
    showNotification
  ) => {
    try {
      const updatedData = {
        username:
          updatedName[userId] ??
          users.find((user) => user._id === userId).username,
        position:
          updatedPosition[userId] ??
          users.find((user) => user._id === userId).position,
        referrals:
          updatedReferrals[userId] ??
          users.find((user) => user._id === userId).referrals,
      };
  
      console.log("Updated data:", updatedData); // Debugging line
  
      const response = await saveUser(userId, updatedData);
      const updatedUser = response.data.data;
  
      if (!response.data.success) {
        showNotification(response.data.message, "error");
        return;
      }
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...updatedUser } : user
        )
      );
  
      setEditMode((prevState) => ({ ...prevState, [userId]: false }));
      showNotification("User updated successfully. Refresh...", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification("Error updating user", "error");
    }
  };
