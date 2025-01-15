// authAPI.ts

import {apiClient} from "@/src/services/apiClient";
import {API_BASE_URL} from "@/src/redux/api/API";
import {LoginPayload, RegisterPayload} from "@/src/types/api/auth/requests";
import {ApiResponse} from "@/src/types/api/common";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

/*
  Define constants for your authentication endpoints.
  You can adjust these to match your actual API routes.
*/
const LOGIN_ENDPOINT = `${API_BASE_URL}/login`;
const REGISTER_ENDPOINT = `${API_BASE_URL}/register`;
const VERIFY_EMAIL_ENDPOINT = `${API_BASE_URL}/verify_email`;

/*
  Example structure for auth-related API calls using the apiClient.
  The return types are defined using your custom ApiResponse interface,
  which can carry additional fields like 'success', 'message', or tokens.
*/
export const authApi = {
    /*
      Logs in a user using a POST request.
      The payload uses the LoginPayload type from your types/api.ts.
      Adjust the ApiResponse generic parameter to match what your actual
      API returns (e.g., { token: string }).
    */
    async login(payload: LoginPayload): Promise<ApiResponse<{ token: string }>> {
        return apiClient.request({
            method: "POST",
            url: LOGIN_ENDPOINT,
            data: payload
        });
    },

    /*
      Registers a user. The payload uses the RegisterPayload type.
      You can adjust the return type to match your registration endpoint’s response
      (e.g., { success: boolean; message: string; token?: string }).
    */
    async register(userData: RegisterPayload): Promise<ApiResponse<{ success: boolean; message: string }>> {
        return apiClient.request({
            method: "POST",
            url: REGISTER_ENDPOINT,
            data: userData
        });
    },

    /*
      Verifies an email using a verification code. You might have a specialized
      payload type such as VerifyCodePayload that includes fields like email
      and verification_code. Adjust accordingly to match your API’s structure.
    */
    async verifyEmail(payload: { verification_code: string; email: string }): Promise<ApiResponse<{
        success: boolean;
        message: string
    }>> {
        return apiClient.request({
            method: "POST",
            url: VERIFY_EMAIL_ENDPOINT,
            data: payload
        });
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