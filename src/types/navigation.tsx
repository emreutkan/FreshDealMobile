export type RootStackParamList = {
    Landing: undefined;
    HomeScreen: undefined;
    AddressSelectionScreen: undefined;
    UpdateAddress: { addressId: string }; // Ensure this is correct
    RestaurantDetails: { restaurantId: string };

};
