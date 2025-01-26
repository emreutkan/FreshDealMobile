export interface NotificationData {
    screen?: string;
    params?: Record<string, any>;
    type?: string;

    [key: string]: any;
}