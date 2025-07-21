import axiosInstance from "./axiosInstance";
import {handleApiError} from "@/utils/apiErrorHandler";
import {UserRequestDTO} from "@/interfaces";

const API_URL = `${import.meta.env.VITE_BASE_API_URL}/auth`;

// API for login
export const loginApi = async (username: string, password: string) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/login`, {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Login failed");
    }
};

// API for registration
export const registerApi = async (userData: UserRequestDTO) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/register`,
            userData,
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Registration failed");
    }
};

// API for Google login
export const loginGoogleApi = async (access_token: string) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/google`,
            {accessToken: access_token},
            {
                headers: {"Content-Type": "application/json"},
            },
        );
        return response.data;
    } catch (error) {
        handleApiError(error, "Google login failed");
    }
};
