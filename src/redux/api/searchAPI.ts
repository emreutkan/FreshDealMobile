import {logError, logRequest, logResponse} from "@/src/utils/logger";
import axios from "axios";
import {API_BASE_URL} from "@/src/redux/api/API";

const SEARCH_API_ENDPOINT = `${API_BASE_URL}/search`;

export const searchAPI = async (searchParams: {
    type: "restaurant" | "listing";
    query: string;
    restaurant_id?: number;
}): Promise<any> => {
    const functionName = 'searchAPI';

    logRequest(functionName, SEARCH_API_ENDPOINT, searchParams);

    try {
        const response = await axios.get(SEARCH_API_ENDPOINT, {params: searchParams});
        logResponse(functionName, SEARCH_API_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, SEARCH_API_ENDPOINT, error);
        throw error;
    }
};
