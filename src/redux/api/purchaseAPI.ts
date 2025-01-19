import {API_BASE_URL} from "@/src/redux/api/API";
import {apiClient} from '@/src/services/apiClient';
import {
    AddCompletionImageResponse,
    CreatePurchaseOrderResponse,
    GetOrderDetailsResponse,
    GetRestaurantPurchasesResponse,
    GetUserActiveOrdersResponse,
    GetUserPreviousOrdersResponse,
    PurchaseResponseResponse,
} from "@/src/types/api/purchase/responses";
import {CreatePurchaseOrderData} from "@/src/types/api/purchase/requests";

const PURCHASE_ENDPOINT = `${API_BASE_URL}/purchase`;

// First, let's define the types for the delivery info and pagination
interface DeliveryInfo {
    delivery_notes?: string;
    delivery_address?: string;
    is_delivery: boolean;
}

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
    async handleRestaurantResponse(
        purchaseId: number,
        action: 'accept' | 'reject',
        token: string
    ): Promise<PurchaseResponseResponse> {
        return apiClient.request({
            method: 'POST',
            url: `${PURCHASE_ENDPOINT}/${purchaseId}/response`,
            data: {action},
            token,
        });
    },

    // Add completion image to purchase
    async addCompletionImage(
        purchaseId: number,
        imageUrl: string,
        token: string
    ): Promise<AddCompletionImageResponse> {
        return apiClient.request({
            method: 'POST',
            url: `${PURCHASE_ENDPOINT}/${purchaseId}/completion-image`,
            data: {image_url: imageUrl},
            token,
        });
    },

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
    async acceptPurchase(
        purchaseId: number,
        token: string
    ): Promise<PurchaseResponseResponse> {
        return apiClient.request({
            method: 'POST',
            url: `${PURCHASE_ENDPOINT}/${purchaseId}/accept`,
            token,
        });
    },

    // Reject purchase (shorthand method)
    async rejectPurchase(
        purchaseId: number,
        token: string
    ): Promise<PurchaseResponseResponse> {
        return apiClient.request({
            method: 'POST',
            url: `${PURCHASE_ENDPOINT}/${purchaseId}/reject`,
            token,
        });
    },

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