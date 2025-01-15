import {ProximityRestaurant, Restaurant} from "@/src/types/api/restaurant/model";

export interface CreateRestaurantResponse {
    success: boolean;
    message: string;
    restaurant: Restaurant;
}


export interface GetRestaurantsResponse extends Array<Restaurant> {
}

export interface GetRestaurantResponse extends Restaurant {
}

export interface DeleteRestaurantResponse {
    success: boolean;
    message: string;
}


export interface GetRestaurantsProximityResponse {
    restaurants: ProximityRestaurant[];
}