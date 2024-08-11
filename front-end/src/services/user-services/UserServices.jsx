  import axios from 'axios';

  const baseUrl = import.meta.env.VITE_USER_API_BASE_URL || 'http://localhost:5051';

  export const generateOtp = async (user) => {
    return axios.post(`${baseUrl}/otp/generate`, user);
  };

  export const verifyOtp = async (user) => {
    return axios.post(`${baseUrl}/otp/verify`, user);
  };

  export const verifyLogin = async(user) => {
    return axios.post(`${baseUrl}/verify/login`, user);
  }

  export const fetchAllUsers = async() => {
    return axios.post(`${baseUrl}/fetch/all-user`);
  }

  export const verifyAdminLogin = async(user) => {
    return axios.post(`${baseUrl}/verify/admin`, user);
  }

  export const verifyGoogleLogin = async(data) => {
    return axios.post(`${baseUrl}/auth/google-login`, data);
  }