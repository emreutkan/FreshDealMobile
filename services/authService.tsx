// services/authService.ts

export interface LoginData {
    phoneNumber: string;
    selectedCode: string;
    password: string;
}

export interface UserData {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    location?: string;
}

export interface ApiResponse {
    success: boolean;
    userData?: UserData;
    message?: string;
}

export const login = async (loginData: LoginData): Promise<ApiResponse> => {
    try {
        const response = await fetch('http://192.168.1.3:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Network response was not ok' };
        }

        const data: ApiResponse = await response.json();
        return data;
    } catch (error) {
        console.error('API Login Error:', error);
        return { success: false, message: 'An error occurred during login.' };
    }
};
