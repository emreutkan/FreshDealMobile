// Add Address API Call
import {Address} from "@/store/slices/addressSlice";
import axios from "axios";
import {API_BASE_URL} from "@/store/api/API";
import {logError, logRequest, logResponse} from "@/src/utils/logger";

const ADDRESS_ENDPOINT = `${API_BASE_URL}/addresses`;

export const addAddressAPI = async (address: Omit<Address, 'id'>, token: string): Promise<any> => {
    const functionName = 'addAddress';
    const payload = address;
    logRequest(functionName, ADDRESS_ENDPOINT, payload);
    try {
        const response = await axios.post(ADDRESS_ENDPOINT, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        logResponse(functionName, ADDRESS_ENDPOINT, response.data);
        return response.data; // Now returns { success, message, address }
    } catch (error: any) {
        logError(functionName, ADDRESS_ENDPOINT, error);
        throw error;
    }
};


export const getAddressesAPI = async (token: string) => {
    const functionName = 'getAddresses';
    logRequest(functionName, ADDRESS_ENDPOINT, {});
    try {
        const response = await axios.get(ADDRESS_ENDPOINT, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, ADDRESS_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, ADDRESS_ENDPOINT, error);
        throw error;
    }
};

export const deleteAddressAPI = async (addressId: string, token: string) => {
    const functionName = 'deleteAddressAPI';
    const DELETE_ADDRESS_ENDPOINT = `${ADDRESS_ENDPOINT}/${addressId}`;
    const payload = {address_id: addressId};
    logRequest(functionName, DELETE_ADDRESS_ENDPOINT, payload);
    try {
        const response = await axios.delete(DELETE_ADDRESS_ENDPOINT, {
            headers: {Authorization: `Bearer ${token}`},
            data: payload
        });
        logResponse(functionName, DELETE_ADDRESS_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, DELETE_ADDRESS_ENDPOINT, error);
        throw error;
    }
};


// Function to update an address
export const updateAddressAPI = async (
    addressId: string,
    updates: Partial<Address>,
    token: string
): Promise<Address> => {
    const functionName = 'updateAddressAPI';
    const UPDATE_ADDRESS_ENDPOINT = `${ADDRESS_ENDPOINT}/${addressId}`;
    const payload = updates;

    logRequest(functionName, UPDATE_ADDRESS_ENDPOINT, payload);

    try {
        const response = await axios.put(UPDATE_ADDRESS_ENDPOINT, payload, {
            headers: {Authorization: `Bearer ${token}`},
        });
        logResponse(functionName, UPDATE_ADDRESS_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, UPDATE_ADDRESS_ENDPOINT, error);
        throw error;
    }
};