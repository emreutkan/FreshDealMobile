export interface Comment {
    id: number;
    user_id: number;
    comment: string;
    rating: number;
    timestamp: string;
    badges: {
        name: string;
        is_positive: boolean;
    }[];
}
