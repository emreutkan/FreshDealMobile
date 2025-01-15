export interface UserAddress {
    id: number;
    title: string;
    longitude: number;
    latitude: number;
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: number;
    apartmentNo: number;
    doorNo: string;
    is_primary: boolean;
}