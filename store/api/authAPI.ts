import axios from "axios";
import {API_BASE_URL} from "@/store/api/API";
import {logError, logRequest, logResponse} from "@/src/utils/logger";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const LOGIN_ENDPOINT = `${API_BASE_URL}/login`;
export const REGISTER_ENDPOINT = `${API_BASE_URL}/register`;
const VERIFY_EMAIL_ENDPOINT = `${API_BASE_URL}/verify_email`;


export const loginUserAPI = async (payload: {
    email?: string;
    phone_number?: string;
    password?: string;
    verification_code?: string;
    step?: "send_code" | "verify_code" | "skip_verification";
    login_type?: "email" | "phone_number";
    password_login?: boolean;
}) => {
    const functionName = 'loginUserAPI';


    logRequest(functionName, LOGIN_ENDPOINT, payload);

    try {
        const response = await axios.post(LOGIN_ENDPOINT, payload);
        logResponse(functionName, LOGIN_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, LOGIN_ENDPOINT, error);
        throw error;
    }
};

interface registerUserPayload {
    name_surname: string;
    email?: string;
    phone_number?: string;
    password: string;
    role: "customer";
}

interface registerUserResponse {
    success: boolean;
    message: string;
}

// User Registration API Call

export const registerUserAPI = async (userData: registerUserPayload) => {
    const functionName = 'registerUserAPI';
    logRequest(functionName, REGISTER_ENDPOINT, userData);

    try {
        const response = await axios.post(REGISTER_ENDPOINT, userData);
        logResponse(functionName, REGISTER_ENDPOINT, response.data);
        console.log('Request URL:', axios.getUri({method: 'POST', url: REGISTER_ENDPOINT}));
        return response.data;
    } catch (error: any) {
        logError(functionName, REGISTER_ENDPOINT, error);
        throw error;
    }
};

interface VerifyCodePayload {
    verification_code: string;
    email: string;
}

interface VerifyCodeResponse {
    success: boolean;
    message: string;
}


export const verifyCode = createAsyncThunk<
    VerifyCodeResponse,
    VerifyCodePayload,
    { rejectValue: string }
>(
    "user/verifyCode",
    async (payload, {rejectWithValue}) => {
        try {
            const response = await axios.post(VERIFY_EMAIL_ENDPOINT, payload);
            if (response.data.success) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error: any) {
            return rejectWithValue(error.message || "Verification failed");
        }
    }
);