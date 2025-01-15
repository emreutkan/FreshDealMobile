// curl -X GET "http://localhost:8000/v1/search?type=restaurant&query=1" -H "accept: application/json"

export interface SearchRestaurantRequest {
    type: string;
    query: string;
}