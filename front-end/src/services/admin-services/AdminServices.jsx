import axios from "axios";
const baseUrl = import.meta.env.VITE_USER_API_BASE_URL || 'http://localhost:5051';

export const deleteAllUser = async() => {
  return axios.delete(`${baseUrl}/delete/all-user`);
}

export const deleteSingleUser = async(userId) => {
  return axios.delete(`${baseUrl}/delete/single-user/${userId}`);
}

export const saveUser = async (userId, updatedData) => {
  return axios.put(`${baseUrl}/users/add/${userId}`, updatedData);
}


export const adminUserAdd = async(addUser) => {
  return axios.post(`${baseUrl}/add/user`, addUser);
}