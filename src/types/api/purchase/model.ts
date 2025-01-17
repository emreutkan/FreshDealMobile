export interface Purchase {
    purchase_id: number;
    user_id: number;
    listing_id: number;
    listing_title: string;
    quantity: number;
    total_price: string;
    purchase_date: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    is_delivery: boolean;
    delivery_address?: string;
    delivery_notes?: string;
    completion_image_url?: string;
    restaurant_id: number;
    restaurant?: {
        id: number;
        name: string;
        image_url?: string;
    };
    listing?: {
        id: number;
        title: string;
        count: number;
    };
}