import {createSlice} from '@reduxjs/toolkit';
import {PurchaseState} from '@/src/types/states';
import {logout} from "@/src/redux/slices/userSlice";
import {
    createPurchaseAsync,
    fetchActiveOrdersAsync,
    fetchOrderDetailsAsync,
    fetchPreviousOrdersAsync,
    fetchRestaurantPurchasesAsync
} from "@/src/redux/thunks/purchaseThunks";

const initialState: PurchaseState = {
    activeOrders: [],
    loadingActiveOrders: false,
    activeOrdersError: null,

    previousOrders: [],
    loadingPreviousOrders: false,
    previousOrdersError: null,
    previousOrdersPagination: {
        currentPage: 1,
        totalPages: 1,
        perPage: 10,
        totalOrders: 0,
        hasNext: false,
        hasPrev: false,
    },

    currentOrder: null,
    loadingCurrentOrder: false,
    currentOrderError: null,

    creatingPurchase: false,
    createPurchaseError: null,
    lastCreatedPurchases: null,

    restaurantPurchases: [],
    loadingRestaurantPurchases: false,
    restaurantPurchasesError: null,
};

const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(logout, () => initialState)
            // Create Purchase
            .addCase(createPurchaseAsync.pending, (state) => {
                state.creatingPurchase = true;
                state.createPurchaseError = null;
            })
            .addCase(createPurchaseAsync.fulfilled, (state, action) => {
                state.creatingPurchase = false;
                state.lastCreatedPurchases = action.payload.purchases;
            })
            .addCase(createPurchaseAsync.rejected, (state, action) => {
                state.creatingPurchase = false;
                state.createPurchaseError = action.payload || 'Failed to create purchase';
            })
            // Active Orders
            .addCase(fetchActiveOrdersAsync.pending, (state) => {
                state.loadingActiveOrders = true;
                state.activeOrdersError = null;
            })
            .addCase(fetchActiveOrdersAsync.fulfilled, (state, action) => {
                state.loadingActiveOrders = false;
                state.activeOrders = action.payload.active_orders;
            })
            .addCase(fetchActiveOrdersAsync.rejected, (state, action) => {
                state.loadingActiveOrders = false;
                state.activeOrdersError = action.payload || 'Failed to fetch active orders';
            })
            // Previous Orders
            .addCase(fetchPreviousOrdersAsync.pending, (state) => {
                state.loadingPreviousOrders = true;
                state.previousOrdersError = null;
            })
            .addCase(fetchPreviousOrdersAsync.fulfilled, (state, action) => {
                state.loadingPreviousOrders = false;
                state.previousOrders = action.payload.orders;
                state.previousOrdersPagination = {
                    currentPage: action.payload.pagination.current_page,
                    totalPages: action.payload.pagination.total_pages,
                    perPage: action.payload.pagination.per_page,
                    totalOrders: action.payload.pagination.total_orders,
                    hasNext: action.payload.pagination.has_next,
                    hasPrev: action.payload.pagination.has_prev,
                };
            })
            .addCase(fetchPreviousOrdersAsync.rejected, (state, action) => {
                state.loadingPreviousOrders = false;
                state.previousOrdersError = action.payload || 'Failed to fetch previous orders';
            })
            // Order Details
            .addCase(fetchOrderDetailsAsync.pending, (state) => {
                state.loadingCurrentOrder = true;
                state.currentOrderError = null;
            })
            .addCase(fetchOrderDetailsAsync.fulfilled, (state, action) => {
                state.loadingCurrentOrder = false;
                state.currentOrder = action.payload.order;
            })
            .addCase(fetchOrderDetailsAsync.rejected, (state, action) => {
                state.loadingCurrentOrder = false;
                state.currentOrderError = action.payload || 'Failed to fetch order details';
            })
            // Restaurant Purchases
            .addCase(fetchRestaurantPurchasesAsync.pending, (state) => {
                state.loadingRestaurantPurchases = true;
                state.restaurantPurchasesError = null;
            })
            .addCase(fetchRestaurantPurchasesAsync.fulfilled, (state, action) => {
                state.loadingRestaurantPurchases = false;
                state.restaurantPurchases = action.payload.purchases;
            })
            .addCase(fetchRestaurantPurchasesAsync.rejected, (state, action) => {
                state.loadingRestaurantPurchases = false;
                state.restaurantPurchasesError = action.payload || 'Failed to fetch restaurant purchases';
            });
    },
});

export default purchaseSlice.reducer;