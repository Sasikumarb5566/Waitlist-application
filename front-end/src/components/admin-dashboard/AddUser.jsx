import React, {useState} from "react";
import { adminUserAdd } from '../../services/admin-services/AdminServices';
import NotificationBar from "../../components/notification-bar/NotificationBar";

const AddUser = ({ setIsFormVisible }) => { 
    const [notification, setNotification] = useState({
        message: "",
        type: "",
        visible: false,
    });

    const showNotification = (message, type) => {
        setNotification({ message, type, visible: true });
        setTimeout(
          () => setNotification({ ...notification, visible: false }),
          5000
        );
    };

    const hideNotification = () => {
        setNotification((prev) => ({ ...prev, visible: false }));
      };
    const [addUser, setAddUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await adminUserAdd(addUser);
        const user = response.data;
        if (!user.success) {
            showNotification(user.message, "error");
            return;
        }
        showNotification(user.message, "success");
    };

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
            {notification.visible && (
        <NotificationBar
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-semibold mb-6 text-center">Add New User</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={addUser.username}
                        onChange={(e) => setAddUser({ ...addUser, username: e.target.value })}
                        required
                        className="border-2 w-full p-3 rounded-full mb-4"
                    />
                    <input
                        type="email"
                        placeholder="abc@gmail.com"
                        name="email"
                        required
                        value={addUser.email}
                        onChange={(e) => setAddUser({ ...addUser, email: e.target.value })}
                        className="border-2 w-full p-3 rounded-full mb-4"
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        required
                        value={addUser.password}
                        onChange={(e) => setAddUser({ ...addUser, password: e.target.value })}
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
                        onClick={() => setIsFormVisible(false)}  // Use setIsFormVisible here
                        className="mt-4 w-full text-center text-red-500"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
