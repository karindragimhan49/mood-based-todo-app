import axios from 'axios';

const BASE = '/api/users';

export const getAllUsers = async () => {
  const { data } = await axios.get(BASE);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await axios.post(BASE, userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await axios.put(`${BASE}/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`${BASE}/${id}`);
  return data;
};
