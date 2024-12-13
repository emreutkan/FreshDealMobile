# `userSlice.ts` Documentation

## Overview

This file defines a Redux slice for managing user-related states, such as login, addresses, cart, and authentication. It
uses `@reduxjs/toolkit` to handle actions, reducers, and asynchronous operations.

---

## Initial State

The initial state is defined as follows:

| **Property**        | **Type**                                              | **Description**                              |
|---------------------|-------------------------------------------------------|----------------------------------------------|
| `phoneNumber`       | `string`                                              | User's phone number.                         |
| `password`          | `string`                                              | User's password.                             |
| `selectedCode`      | `string`                                              | Selected phone country code (e.g., "+90").   |
| `email`             | `string`                                              | User's email.                                |
| `name_surname`      | `string`                                              | Full name of the user.                       |
| `passwordLogin`     | `boolean`                                             | Whether login is password-based.             |
| `verificationCode`  | `string`                                              | Verification code for 2FA or email.          |
| `step`              | `"send_code" \| "verify_code" \| "skip_verification"` | Current step in the login/registration flow. |
| `login_type`        | `"email" \| "phone_number"`                           | The selected login method.                   |
| `cart`              | `CartItem[]`                                          | List of items in the user's cart.            |
| `addresses`         | `Address[]`                                           | List of user addresses.                      |
| `selectedAddressId` | `string \| null`                                      | ID of the currently selected address.        |
| `loading`           | `boolean`                                             | Whether an API request is loading.           |
| `error`             | `string \| null`                                      | Error message from failed API requests.      |
| `token`             | `string \| null`                                      | User's authentication token.                 |

---

## Data Structures

### **CartItem**

```typescript
interface CartItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}
```

### **Address**

```typescript
interface Address {
    id: string; // Unique identifier
    street: string;
    neighborhood: string;
    district: string;
    province: string;
    country: string;
    postalCode: string;
    apartmentNo: string;
    doorNo: string;
}
```

---

## Reducers

| **Reducer**           | **Payload Type**            | **Description**                                    |
|-----------------------|-----------------------------|----------------------------------------------------|
| `setSelectedCode`     | `string`                    | Sets the country code for the phone number.        |
| `setPhoneNumber`      | `string`                    | Updates the phone number with numeric values only. |
| `setEmail`            | `string`                    | Updates the user's email.                          |
| `setName`             | `string`                    | Sets the user's full name.                         |
| `setStep`             | `"send_code" \| ...`        | Updates the login step (send, verify, or skip).    |
| `setLoginType`        | `"email" \| "phone_number"` | Changes the login type.                            |
| `setPasswordLogin`    | `boolean`                   | Sets whether the login method is password-based.   |
| `setVerificationCode` | `string`                    | Sets the verification code.                        |
| `setPassword`         | `string`                    | Updates the user's password.                       |
| `setToken`            | `string`                    | Stores the authentication token.                   |
| `addToCart`           | `CartItem`                  | Adds an item to the user's cart.                   |
| `removeFromCart`      | `string`                    | Removes an item from the cart by ID.               |
| `clearCart`           | `void`                      | Clears all items from the cart.                    |
| `addAddress`          | `Omit<Address, 'id'>`       | Adds a new address with a unique ID.               |
| `removeAddress`       | `string`                    | Removes an address by ID.                          |
| `setSelectedAddress`  | `string`                    | Sets a selected address by its ID.                 |
| `logout`              | `void`                      | Logs out the user and resets the state.            |

---

## Async Thunks

### **`addAddressAsync`**

- **Description**: Adds an address to the user's list, with optimistic updates and rollback on failure.
- **Input**: `Omit<Address, 'id'>`
- **Output**: `Address` (full address object with server-generated ID).
- **Error Handling**: Rolls back the temporary address if the API call fails.

```typescript
export const addAddressAsync = createAsyncThunk<
    Address,
    Omit<Address, 'id'>,
    { rejectValue: string; state: RootState }
>(
    'user/addAddressAsync',
    async (address, {rejectWithValue, getState, dispatch}) => {
        const tempId = `temp-${Date.now()}`;
        const tempAddress = {...address, id: tempId};
        dispatch(addAddress(tempAddress));

        try {
            const token = getState().user.token;
            if (!token) throw new Error('Authentication token is missing.');
            const response = await addAddressAPI(address, token);
            return response as Address;
        } catch (error: any) {
            dispatch(removeAddress(tempId));
            return rejectWithValue(error.response?.data?.message || 'Failed to add address');
        }
    }
);
```

### **`loginUser`**

- **Description**: Handles user login with email, phone number, password, and verification code.
- **Input**:
   ```typescript
   {
       email?: string;
       phone_number?: string;
       password?: string;
       verification_code?: string;
       step?: "send_code" | "verify_code" | "skip_verification";
       login_type?: "email" | "phone_number";
       password_login?: boolean;
   }
   ```
- **Output**: Returns user data on success.
- **Error Handling**: Captures API errors and rejects with a message.

---

### **`registerUser`**

- **Description**: Handles user registration.
- **Input**:
   ```typescript
   {
       name_surname: string;
       email?: string;
       phone_number?: string;
       password: string;
   }
   ```
- **Output**: Returns user data on successful registration.
- **Error Handling**: Captures network or API errors and rejects with a message.

---

## Notes

- **Optimistic Updates**: The `addAddressAsync` thunk optimistically updates the address list to enhance user
  experience.
- **Error Rollback**: Ensures that temporary data is removed if API requests fail.
- **State Management**: Combines reducers and async thunks for better separation of concerns.

