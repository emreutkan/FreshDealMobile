export interface CreateAddressPayload {
    title: string;
    longitude: number;
    latitude: number;
    street: string;
    neighborhood?: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo?: string;
    doorNo?: string;
}

export interface UpdateAddressPayload {
    title?: string;
    // Note: latitude and longitude are read-only and will be ignored if provided.
    street?: string;
    neighborhood?: string;
    district?: string;
    province?: string;
    country?: string;
    postalCode?: string;
    apartmentNo?: string;
    doorNo?: string;
    is_primary?: boolean;
}
