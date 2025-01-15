import {API_BASE_URL} from "@/src/redux/api/API";
import {RestaurantSearchResult, SearchResponse} from "@/src/types/api/search/responses";

import {apiClient} from '@/src/services/apiClient';

const SEARCH_API_ENDPOINT = `${API_BASE_URL}/search`;


export const searchApi = {

    async RestaurantSearch(searchParams: {
                               type: "restaurant";
                               query: string;
                           }
    ): Promise<SearchResponse<RestaurantSearchResult>> {
        return apiClient.request({
            method: 'GET',
            url: SEARCH_API_ENDPOINT,
            params: searchParams,
        });
    }
};