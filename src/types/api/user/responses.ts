import {UserAddress} from "@/src/types/api/address/model";
import {UserData} from "@/src/types/api/user/model";

export interface UserDataResponse {
    user_data: UserData;
    user_address_list: UserAddress[];
}

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
