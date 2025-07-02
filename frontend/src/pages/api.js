import axios from "axios";

const URL = "http://localhost:5000"

// Create functions from userRoutes
export async function getUsers(){
    const response = await axios.get(`${URL}/users`)

    if (response.status === 200){
        return response.data
    } else {
        return
    }
}

export async function loginUser({ user_id, user_password }) {
  const response = await axios.post(`${URL}/users/login`, { user_id, user_password });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Login failed");
  }
}

export async function getUser(id){
    const response = await axios.get(`${URL}/users/${id}`)

    if (response.status === 200){
        return response.data
    } else {
        return
    }
}

export async function registerUser(user){
    const response = await axios.post(`${URL}/users`, user)

    return response 
}

export async function updateUser(id, user){
    const response = await axios.put(`${URL}/users/${id}`, user)

    return response 
}

export async function deleteUser(id){
    const response = await axios.delete(`${URL}/users/${id}`)

    return response // to make sure deletion is successful
}