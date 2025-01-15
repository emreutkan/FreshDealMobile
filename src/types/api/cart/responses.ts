import {CartItem} from "@/src/types/api/cart/model";

export interface CartOperationResponse {
    /** Indicates whether the operation was successful */
    success: boolean;
    /** A message describing the operation's result */
    message: string;
}

export interface CartResponse {
    /** Indicates whether the operation was successful */
    success: boolean;
    /** The array of items currently in the cart */
    cart: CartItem[];
}