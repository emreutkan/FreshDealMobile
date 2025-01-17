// Add these new interfaces to your responses.ts file

import {Purchase} from "@/src/types/api/purchase/model";

export interface CreatePurchaseResponse {
    message: string;
    purchases: {
        id: number;
        user_id: number;
        listing_id: number;
        quantity: number;
        restaurant_id: number;
        total_price: string;
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
        is_delivery: boolean;
        delivery_address?: string;
        delivery_notes?: string;
        purchase_date: string;
        completion_image_url?: string;
    }[];
}

export interface PurchaseResponseResponse {
    message: string;
    purchase: {
        id: number;
        user_id: number;
        listing_id: number;
        quantity: number;
        restaurant_id: number;
        total_price: string;
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
        is_delivery: boolean;
        delivery_address?: string;
        delivery_notes?: string;
        purchase_date: string;
        completion_image_url?: string;
        listing?: {
            id: number;
            title: string;
            count: number;
        };
        restaurant?: {
            id: number;
            name: string;
        };
    };
}

export interface AddCompletionImageResponse {
    message: string;
    purchase: {
        id: number;
        user_id: number;
        listing_id: number;
        quantity: number;
        restaurant_id: number;
        total_price: string;
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
        is_delivery: boolean;
        delivery_address?: string;
        delivery_notes?: string;
        purchase_date: string;
        completion_image_url: string;
        listing?: {
            id: number;
            title: string;
        };
        restaurant?: {
            id: number;
            name: string;
        };
    };
}


export interface GetRestaurantPurchasesResponse {
    purchases: Purchase[];
}

export interface GetUserActiveOrdersResponse {
    active_orders: Array<{
        purchase_id: number;
        restaurant_name: string;
        listing_title: string;
        quantity: number;
        total_price: string;
        status: 'PENDING' | 'ACCEPTED';
        purchase_date: string;
        is_active: boolean;
        is_delivery: boolean;
        delivery_address?: string;
        delivery_notes?: string;
        restaurant_details: {
            id: number;
            name: string;
            image_url: string;
        };
    }>;
}

export interface GetUserPreviousOrdersResponse {
    orders: Array<{
        id: number;
        listing_title: string;
        quantity: number;
        total_price: string;
        formatted_total_price: string;
        status: 'COMPLETED' | 'REJECTED';
        purchase_date: string;
        is_delivery: boolean;
        delivery_address?: string;
        delivery_notes?: string;
        completion_image_url?: string;
    }>;
    pagination: {
        current_page: number;
        total_pages: number;
        per_page: number;
        total_orders: number;
        has_next: boolean;
        has_prev: boolean;
    };
}

export interface GetOrderDetailsResponse {
    order: {
        id: number;
        listing_title: string;
        quantity: number;
        total_price: string;
        formatted_total_price: string;
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
        purchase_date: string;
        is_active: boolean;
        is_delivery: boolean;
        delivery_address?: string;
        delivery_notes?: string;
        completion_image_url?: string;
        listing: {
            id: number;
            title: string;
        };
        restaurant: {
            id: number;
            name: string;
        };
    };
}