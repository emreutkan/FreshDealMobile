export interface UpdatePasswordPayload {
    old_password: string;
    new_password: string;
}

export interface UpdateUsernamePayload {
    username: string;
}

export interface UpdateEmailPayload {
    old_email: string;
    new_email: string;
}

export interface AddFavoritePayload {
    restaurant_id: number;
}

export interface RemoveFavoritePayload {
    restaurant_id: number;
}