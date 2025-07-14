import axios from "axios";

const URL = "http://localhost:5000"

// Create functions from userRoutes
export async function getUsers() {
    const response = await axios.get(`${URL}/users`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function loginUser(user) {
    const response = await axios.post(`${URL}/users/login`, user);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error("Login failed");
    }
}

export async function getUser(id) {
    const response = await axios.get(`${URL}/users/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function registerUser(user) {
    const response = await axios.post(`${URL}/users`, user)

    return response
}

export async function updateUser(id, user) {
    const response = await axios.put(`${URL}/users/${id}`, user)

    return response
}

export async function deleteUser(id) {
    const response = await axios.delete(`${URL}/users/${id}`)

    return response // to make sure deletion is successful
}

// === SEAT RESERVATION API FUNCTIONS ===

// Get seat reservations for a specific date, lab, and time slot
export async function getSeatReservations(date, lab, timeSlot) {
    try {
        const response = await axios.get(`${URL}/reservations/${date}/${lab}/${timeSlot}`);
        if (response.status === 200) {
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        console.error("Error getting seat reservations:", error);
        return {};
    }
}

// Create or update a seat reservation
export async function updateSeatReservation(date, lab, timeSlot, seatIndex, status, occupantName, user_id = null) {
    try {
        const response = await axios.post(`${URL}/reservations`, {
            date,
            lab,
            timeSlot,
            seatIndex,
            status,
            occupantName,
            user_id
        });
        return response.data;
    } catch (error) {
        console.error("Error updating seat reservation:", error);
        throw error;
    }
}

// Clear a seat reservation (make it vacant)
export async function clearSeatReservation(date, lab, timeSlot, seatIndex) {
    try {
        const response = await axios.post(`${URL}/reservations/clear`, {
            date,
            lab,
            timeSlot,
            seatIndex
        });
        return response.data;
    } catch (error) {
        console.error("Error clearing seat reservation:", error);
        throw error;
    }
}

// Toggle blocked seat
export async function toggleBlockedSeat(date, lab, timeSlot, seatIndex) {
    try {
        const response = await axios.post(`${URL}/reservations/toggle-block`, {
            date,
            lab,
            timeSlot,
            seatIndex
        });
        return response.data;
    } catch (error) {
        console.error("Error toggling blocked seat:", error);
        throw error;
    }
}

// Clear all reservations for a specific date, lab, and time slot
export async function clearAllReservations(date, lab, timeSlot) {
    try {
        const response = await axios.delete(`${URL}/reservations/clear-all`, {
            data: { date, lab, timeSlot }
        });
        return response.data;
    } catch (error) {
        console.error("Error clearing all reservations:", error);
        throw error;
    }
}

// === USER RESERVATION FUNCTIONS ===

// Get all reservations for a specific user
export async function getUserReservations(user_id) {
    try {
        console.log("API: Fetching reservations for user_id:", user_id);
        console.log("API: Making request to:", `${URL}/user-reservations/${user_id}`);
        
        const response = await axios.get(`${URL}/user-reservations/${user_id}`);
        console.log("API: Response status:", response.status);
        console.log("API: Response data:", response.data);
        
        if (response.status === 200) {
            return response.data;
        } else {
            console.log("API: Non-200 status, returning empty array");
            return [];
        }
    } catch (error) {
        console.error("API: Error getting user reservations:", error);
        console.error("API: Error details:", error.response?.data || error.message);
        return [];
    }
}

// === LABS API ===
export async function getLabs() {
    try {
        const response = await axios.get(`${URL}/labs`);
        if (response.status === 200) {
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting labs:", error);
        return [];
    }
}