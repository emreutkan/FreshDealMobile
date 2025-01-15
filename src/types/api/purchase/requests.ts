export interface CreatePurchasePayload {
    delivery_info?: {
        address: string;
        notes?: string;
    };
}


export interface CreateReportPayload {
    purchase_id: number;
    image_url?: string;
    description: string;
}


export interface AddCommentPayload {
    comment: string;
    rating: number; // between 0 and 5
    purchase_id: number;
}


