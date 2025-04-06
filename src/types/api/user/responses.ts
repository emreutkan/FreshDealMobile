export interface UpdateUsernameResponse {
    message: string;
}

export interface UpdateEmailResponse {
    message: string;
}

export interface UpdatePasswordResponse {
    message: string;
}

export interface AddFavoriteResponse {
    message: string;
}

export interface RemoveFavoriteResponse {
    message: string;
}

export interface GetFavoritesResponse {
    favorites: number[];
}

export interface UserDataResponse {
    user_data: {
        id: number;
        name: string;
        email: string;
        phone_number: string;
        role: string;
        email_verified: boolean;
    };
    user_address_list: Array<{
        id: number;
        title: string;
        longitude: number;
        latitude: number;
        street: string;
        neighborhood: string;
        district: string;
        province: string;
        country: string;
        postalCode: number;
        apartmentNo: number;
        doorNo: string;
        is_primary: boolean;
    }>;
}