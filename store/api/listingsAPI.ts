// Get Listings API Call
import {Listing} from "@/store/slices/listingSlice";
import axios from "axios";
import {logError, logRequest, logResponse} from "@/src/utils/logger";
import {API_BASE_URL} from "@/store/api/API";


export const getListingsAPI = async (params: { restaurantId: number; page?: number; perPage?: number }): Promise<{
    success: boolean;
    data: Listing[];
    pagination: any
}> => {
    const functionName = 'getListingsAPI';
    const LISTINGS_ENDPOINT = `${API_BASE_URL}/${params.restaurantId}/listings`;


    logRequest(functionName, LISTINGS_ENDPOINT, params);

    try {
        const response = await axios.get(LISTINGS_ENDPOINT, {params});
        logResponse(functionName, LISTINGS_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, LISTINGS_ENDPOINT, error);
        throw error;
    }
};
