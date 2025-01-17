import {createAsyncThunk} from '@reduxjs/toolkit';
import {purchaseAPI} from '@/src/redux/api/purchaseAPI';
import {RootState} from '../store';
import {Address} from "@/src/types/api/address/model";
import {tokenService} from "@/src/services/tokenService";
// import {DeliveryInfo} from "@/src/types/api/purchase/responses";

// Helper function to serialize address for delivery info
const serializeAddressForDelivery = (address: Address): string => {
    const parts = [
        address.street,
        address.neighborhood,
        address.district,
        address.province,
        address.country,
    ].filter(Boolean);

    if (address.apartmentNo) {
        parts.push(`Apt: ${address.apartmentNo}`);
    }
    if (address.doorNo) {
        parts.push(`Door: ${address.doorNo}`);
    }

    return parts.join(', ');
};

export const createPurchaseAsync = createAsyncThunk<
    any, // Replace with proper type from your API response
    { addressId?: string; notes?: string },
    { state: RootState; rejectValue: string }
>(
    'purchase/createPurchase',
    async ({addressId, notes}, {getState, rejectWithValue}) => {
        try {
            const state = getState();
            const token = await tokenService.getToken();

            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }

            let deliveryInfo = {
                address: 'Unknown',
                notes: notes
            }

            if (addressId) {
                const address = state.address.addresses.find(addr => addr.id === addressId);
                if (address) {
                    deliveryInfo = {
                        address: serializeAddressForDelivery(address),
                        notes: notes
                    };
                }
            }

            const response = await purchaseAPI.createPurchaseOrder(token, deliveryInfo);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create purchase');
        }
    }
);

export const fetchActiveOrdersAsync = createAsyncThunk<
    any,
    void,
    { state: RootState; rejectValue: string }
>(
    'purchase/fetchActiveOrders',
    async (_, {getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            return await purchaseAPI.getUserActiveOrders(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch active orders');
        }
    }
);

export const fetchPreviousOrdersAsync = createAsyncThunk<
    any,
    { page?: number; perPage?: number },
    { state: RootState; rejectValue: string }
>(
    'purchase/fetchPreviousOrders',
    async ({page = 1, perPage = 10}, {getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            return await purchaseAPI.getUserPreviousOrders(token, {page, per_page: perPage});
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch previous orders');
        }
    }
);

export const fetchOrderDetailsAsync = createAsyncThunk<
    any,
    number,
    { state: RootState; rejectValue: string }
>(
    'purchase/fetchOrderDetails',
    async (purchaseId, {getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            return await purchaseAPI.getOrderDetails(purchaseId, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
        }
    }
);

export const handlePurchaseResponseAsync = createAsyncThunk<
    any,
    { purchaseId: number; action: 'accept' | 'reject' },
    { state: RootState; rejectValue: string }
>(
    'purchase/handleResponse',
    async ({purchaseId, action}, {getState, rejectWithValue, dispatch}) => {
        try {
            const token = tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }

            const response = await purchaseAPI.handleRestaurantResponse(purchaseId, action, token);

            // Refresh restaurant purchases after action
            const restaurantId = getState().address.selectedAddressId;
            if (restaurantId) {
                await dispatch(fetchRestaurantPurchasesAsync(Number(restaurantId)));
            }

            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to handle purchase response');
        }
    }
);

export const fetchRestaurantPurchasesAsync = createAsyncThunk<
    any,
    number,
    { state: RootState; rejectValue: string }
>(
    'purchase/fetchRestaurantPurchases',
    async (restaurantId, {getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            return await purchaseAPI.getRestaurantPurchases(restaurantId, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant purchases');
        }
    }
);