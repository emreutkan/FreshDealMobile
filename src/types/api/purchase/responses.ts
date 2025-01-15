export interface RestaurantResponsePayload {
    action: "accept" | "reject";
}


export interface AddCompletionImagePayload {
    image_url: string;
}

export interface CreateReportResponse {
    message: string;
    report_id: number;
}


export interface GetUserReportsResponse {
    reports: Report[];
}


export interface AddCommentResponse {
    success: boolean;
    message: string;
}