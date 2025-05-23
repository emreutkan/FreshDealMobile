import axios from 'axios';
import {getRestaurantDetails, getRestaurants} from '../../src/services/restaurantService';
import {API_BASE_URL} from '../../src/redux/api/API';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Restaurant Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches restaurants successfully', async () => {
        const mockRestaurants = [
            {id: 1, name: 'Restaurant 1'},
            {id: 2, name: 'Restaurant 2'}
        ];

        mockedAxios.get.mockResolvedValueOnce({
            data: {restaurants: mockRestaurants}
        });

        const result = await getRestaurants({latitude: 40.7, longitude: -74.0, radius: 5});

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${API_BASE_URL}/restaurants/by-proximity`,
            expect.objectContaining({
                params: {
                    latitude: 40.7,
                    longitude: -74.0,
                    radius: 5
                }
            })
        );
        expect(result).toEqual({restaurants: mockRestaurants});
    });

    it('handles error when fetching restaurants fails', async () => {
        const errorMessage = 'Network Error';
        mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

        await expect(
            getRestaurants({latitude: 40.7, longitude: -74.0, radius: 5})
        ).rejects.toThrow(errorMessage);
    });

    it('fetches restaurant details successfully', async () => {
        const mockRestaurant = {
            id: 1,
            name: 'Restaurant 1',
            description: 'Test description'
        };

        mockedAxios.get.mockResolvedValueOnce({
            data: {restaurant: mockRestaurant}
        });

        const result = await getRestaurantDetails(1);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${API_BASE_URL}/restaurants/1`
        );
        expect(result).toEqual({restaurant: mockRestaurant});
    });
});