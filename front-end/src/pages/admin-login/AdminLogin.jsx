import React, { useState} from 'react'
import { LoginData } from '../../utils/data-validation/SignupData';
import { verifyAdminLogin } from '../../services/user-services/UserServices';
import { useNavigate } from 'react-router-dom';
import NotificationBar from "../../components/notification-bar/NotificationBar";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData ] = useState({
    email: "",
    password: ""
  });
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification({ ...notification, visible: false }), 5000);
  };
  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(LoginData(formData)) {
      try {
        setIsLoading(true);
        const response = await verifyAdminLogin(formData);
        const admin = response.data;
        if(!admin.success) {
          showNotification(admin.message, "error");
          setIsLoading(false);
          return;
        }
        navigate("/admin-dashboard", {state: {email: formData.email}});
        showNotification(admin.message, "success");
        setIsLoading(false);
      }
      catch(error) {
        console.log("Error in verifying admin: ", error);
        setIsLoading(false);
      }
    }
    else {
      showNotification("Enter valid email and password", "error");
    }
  }

  return (
    <div className="bg-[#ecf0fe] flex items-center justify-center min-h-screen">
      {notification.visible && (
        <NotificationBar message={notification.message} type={notification.type} onClose={hideNotification} />
      )}
      <div className="bg-white p-8 rounded-3xl shadow-xl md:max-w-md w-full max-w-sm">
        <div className="font-bold text-center mb-8 text-2xl">Admin</div>
        <div>
          <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="admin@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
          </div>
          <div className="flex justify-around border rounded-full bg-[#4669ff]">
            <button className="w-1/2  p-3 rounded-full text-white" type="submit">
            {isLoading ? (
              <div className="flex space-x-2 justify-center items-center dark:invert p-1">
                <span className="sr-only">Loading...</span>
                <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.14s]"></div>
                <div className="h-3 w-3 bg-black rounded-full animate-bounce"></div>
              </div>
            ) : (
              "Check"
            )}</button>
          </div>
          </form>
        </div>
        
      </div>
      </div>
  )
}

export default AdminLogin
