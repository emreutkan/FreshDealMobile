import axios from "axios";
import {logError, logRequest, logResponse} from "@/src/utils/logger";
import {API_BASE_URL} from "@/src/redux/api/API";

const REPORTS_ENDPOINT = `${API_BASE_URL}/report`;

// Types
export interface Report {
    report_id: number;
    purchase_id: number;
    listing_id: number;
    restaurant_id: number;
    image_url: string | null;
    description: string;
    reported_at: string | null;
}

export interface CreateReportRequest {
    purchase_id: number;
    image: File;  // Changed from image_url to image
    description: string;
}

// Create Report API Call
export const createReport = async (
    reportData: CreateReportRequest,
    token: string
): Promise<Report> => {
    const functionName = 'createReport';
    const endpoint = REPORTS_ENDPOINT;

    // Create FormData instance
    const formData = new FormData();
    formData.append('purchase_id', reportData.purchase_id.toString());
    formData.append('description', reportData.description);
    formData.append('image', reportData.image);

    // Log the request (excluding the file content for clarity)
    logRequest(functionName, endpoint, {
        purchase_id: reportData.purchase_id,
        description: reportData.description,
        image: reportData.image.name
    });

    try {
        const response = await axios.post(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Changed content type
            },
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Get User Reports API Call
export const getUserReports = async (token: string): Promise<Report[]> => {
    const functionName = 'getUserReports';
    const endpoint = REPORTS_ENDPOINT;

    logRequest(functionName, endpoint, {});

    try {
        const response = await axios.get(endpoint, {
            headers: {Authorization: `Bearer ${token}`},
        });
        logResponse(functionName, endpoint, response.data);
        return response.data.reports;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

