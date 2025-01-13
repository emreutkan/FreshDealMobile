export const logRequest = (functionName: string, endpoint: string, payload: any) => {
    console.log(`[REQUEST] [${functionName}] Endpoint: ${endpoint}`);
    console.log(`[REQUEST] [${functionName}] Payload:`, JSON.stringify(payload, null, 2));
};

export const logResponse = (functionName: string, endpoint: string, response: any) => {
    console.log(`[RESPONSE] [${functionName}] Endpoint: ${endpoint}`);
    console.log(`[RESPONSE] [${functionName}] Data:`, JSON.stringify(response, null, 2));
};

export const logError = (functionName: string, endpoint: string, error: any) => {
    console.error(`[ERROR] [${functionName}] Endpoint: ${endpoint}`);
    if (error.response) {
        console.error(`[ERROR] [${functionName}] Status: ${error.response.status}`);
        console.error(`[ERROR] [${functionName}] Data:`, error.response.data);
    } else {
        console.error(`[ERROR] [${functionName}] Message: ${error.message}`);
    }
};