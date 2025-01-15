export interface LoginPayload {
    email?: string;
    phone_number?: string;
    password?: string;
    verification_code?: string;
    step?: "send_code" | "verify_code" | "skip_verification";
    login_type?: "email" | "phone_number";
    password_login?: boolean;
}

export interface RegisterPayload {
    name_surname: string;
    email?: string;
    phone_number?: string;
    password: string;
    role: "customer" | "owner";
}
