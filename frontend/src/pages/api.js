import axios from "axios";

const URL = "http://localhost:3000"

// Create functions from userRoutes
export async function getPosts(){
    const response = await axios.get(`${URL}/users`)

    if (response.status == 200){
        return response.data
    } else {
        return
    }
}

export async function getPost(id){
    const response = await axios.get(`${URL}/users/${id}`)

    if (response.status == 200){
        return response.data
    } else {
        return
    }
}

export async function registerUser(post){
    const response = await axios.post(`${URL}/users`, post)

    return response 
}

export async function updateUser(id, post){
    const response = await axios.put(`${URL}/users/${id}`, post)

    return response 
}

export async function deleteUser(id){
    const response = await axios.delete(`${URL}/users/${id}`)

    return response // to make sure deletion is successful
}