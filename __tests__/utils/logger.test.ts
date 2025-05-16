import {logError, logRequest, logResponse} from '../../src/utils/logger';

describe('Logger Utility', () => {
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    describe('logRequest', () => {
        it('logs request information correctly', () => {
            const functionName = 'testFunction';
            const endpoint = '/api/test';
            const payload = {data: 'test'};

            logRequest(functionName, endpoint, payload);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                '[REQUEST] [testFunction] Endpoint: /api/test'
            );
            expect(consoleLogSpy).toHaveBeenCalledWith(
                '[REQUEST] [testFunction] Payload:',
                JSON.stringify(payload, null, 2)
            );
        });
    });

    describe('logResponse', () => {
        it('logs response information correctly', () => {
            const functionName = 'testFunction';
            const endpoint = '/api/test';
            const response = {status: 'success'};

            logResponse(functionName, endpoint, response);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                '[RESPONSE] [testFunction] Endpoint: /api/test'
            );
            expect(consoleLogSpy).toHaveBeenCalledWith(
                '[RESPONSE] [testFunction] Data:',
                JSON.stringify(response, null, 2)
            );
        });
    });

    describe('logError', () => {
        it('logs error with response correctly', () => {
            const functionName = 'testFunction';
            const endpoint = '/api/test';
            const error = {
                response: {
                    status: 404,
                    data: {message: 'Not found'}
                }
            };

            logError(functionName, endpoint, error);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[ERROR] [testFunction] Endpoint: /api/test'
            );
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[ERROR] [testFunction] Status: 404'
            );
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[ERROR] [testFunction] Data:',
                {message: 'Not found'}
            );
        });

        it('logs error without response correctly', () => {
            const functionName = 'testFunction';
            const endpoint = '/api/test';
            const error = new Error('Network error');

            logError(functionName, endpoint, error);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[ERROR] [testFunction] Endpoint: /api/test'
            );
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[ERROR] [testFunction] Message: Network error'
            );
        });
    });
});