export interface Address {
    id: string;
    title: string;
    longitude: number;
    latitude: number;
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
    doorNo: string;
    is_primary: boolean;
}