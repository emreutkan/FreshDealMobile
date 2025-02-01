import {API_BASE_URL} from "@/src/redux/api/API";
import {apiClient} from '@/src/services/apiClient';
import {
    CreatePurchaseOrderResponse,
    GetOrderDetailsResponse,
    GetRestaurantPurchasesResponse,
    GetUserActiveOrdersResponse,
    GetUserPreviousOrdersResponse,
} from "@/src/types/api/purchase/responses";
import {CreatePurchaseOrderData} from "@/src/types/api/purchase/requests";

const PURCHASE_ENDPOINT = `${API_BASE_URL}/purchase`;


interface PaginationParams {
    page?: number;
    per_page?: number;
}


export const purchaseAPI = {
    // Create a purchase order
    async createPurchaseOrder(
        token: string,
        requestData: CreatePurchaseOrderData  // Use the proper type directly
    ): Promise<CreatePurchaseOrderResponse> {
        return apiClient.request({
            method: 'POST',
            url: PURCHASE_ENDPOINT,
            data: requestData,  // Send the data directly
            token,
        });
    },

    // Handle restaurant response to purchase (accept/reject)
    // Add completion image to purchase
    // Get restaurant purchases
    async getRestaurantPurchases(
        restaurantId: number,
        token: string
    ): Promise<GetRestaurantPurchasesResponse> {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/restaurant/${restaurantId}/purchases`,
            token,
        });
    },

    // Accept purchase (shorthand method)
    // Reject purchase (shorthand method)
    // New endpoints based on Flask implementation

    // Get user's active orders
    async getUserActiveOrders(
        token: string
    ): Promise<GetUserActiveOrdersResponse> {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/orders/active`,
            token,
        });
    },

    // Get user's previous orders
    async getUserPreviousOrders(
        token: string,
        params?: PaginationParams
    ): Promise<GetUserPreviousOrdersResponse> {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/orders/previous`,
            params: {
                page: params?.page || 1,
                per_page: params?.per_page || 10
            },
            token,
        });
    },

    // Get order details
    async getOrderDetails(
        purchaseId: number,
        token: string
    ): Promise<GetOrderDetailsResponse> {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/orders/${purchaseId}`,
            token,
        });
    },

};