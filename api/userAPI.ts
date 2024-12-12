// api/userAPI.ts
import axios from 'axios';
import API_BASE_URL from './API';


const LOGIN_API_ENDPOINT = `${API_BASE_URL}/v1/login`;

// Flexible Login API Call
export const loginUserAPI = async (payload: {
    email?: string;
    phone_number?: string;
    password?: string;
    verification_code?: string;
    step?: "send_code" | "verify_code" | "skip_verification";
    login_type?: "email" | "phone_number";
    password_login?: boolean;
}) => {
    const response = await axios.post(LOGIN_API_ENDPOINT, payload);
    return response.data;
};

// // TODO
// // Fetch user profile API call
// export const fetchUserProfileAPI = async () => {
//     const response = await axios.get(`${API_BASE_URL}/profile`);
//     return response.data;
// };
//
// // Update user data API call
// export const updateUserAPI = async (payload: any) => {
//     const response = await axios.put(`${API_BASE_URL}/profile`, payload);
//     return response.data;
// };
//
// // Logout user API call
// export const logoutUserAPI = async () => {
//     const response = await axios.post(`${API_BASE_URL}/logout`);
//     return response.data;
// };
