import {Listing} from "@/src/types/api/listing/model";
import {Pagination} from "@/src/types/api/common";

export interface GetListingsResponse {
    success: boolean;
    data: Listing[];
    pagination: Pagination;
}
