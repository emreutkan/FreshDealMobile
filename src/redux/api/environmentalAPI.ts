import {apiClient} from "@/src/services/apiClient";
import {API_BASE_URL} from "@/src/redux/api/API";
import {logError, logRequest, logResponse} from "@/src/utils/logger";

const ENVIRONMENTAL_ENDPOINT = `${API_BASE_URL}/environmental/contributions`;

export interface EnvironmentalData {
    total_co2_avoided: number;
    monthly_co2_avoided: number;
}

export const getEnvironmentalData = async (token: string): Promise<EnvironmentalData> => {
    const functionName = 'getEnvironmentalData';

    logRequest(functionName, ENVIRONMENTAL_ENDPOINT, {});

    try {
        const response = await apiClient.request<EnvironmentalData>({
            method: 'GET',
            url: ENVIRONMENTAL_ENDPOINT,
            token,
        });

        console.log(`[DEBUG][2025-05-14 10:41:38][emreutkan] ${functionName}: Response received:`,
            JSON.stringify(response, null, 2));

        logResponse(functionName, ENVIRONMENTAL_ENDPOINT, response);

        return response;
    } catch (error: any) {
        console.log(`[DEBUG][2025-05-14 10:41:38][emreutkan] ${functionName}: Error in API call:`, error);
        logError(functionName, ENVIRONMENTAL_ENDPOINT, error);
        throw error;
    }
};