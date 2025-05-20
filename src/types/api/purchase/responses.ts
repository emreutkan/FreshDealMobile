import {Purchase} from "@/src/types/api/purchase/model";

export interface PurchaseOrder {
    completion_image_url?: string;
    delivery_address?: string;
    delivery_notes?: string;
    formatted_total_price: string;
    is_active: boolean;
    is_delivery: boolean;
    listing_id: number;
    listing_title: string;
    purchase_date: string;
    purchase_id: number;
    quantity: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    total_price: string;
    user_id: number;
    restaurant_id: number;

}


export interface CreatePurchaseOrderResponse {
    message: string;
    purchases: PurchaseOrder[];
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