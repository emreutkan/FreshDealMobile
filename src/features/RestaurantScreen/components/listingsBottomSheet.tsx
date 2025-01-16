import React, {useMemo, useRef} from 'react';
import {StyleSheet, View,} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import ListingCard from "@/src/features/RestaurantScreen/components/listingsCard";
import PickupDeliveryToggle from "@/src/features/RestaurantScreen/components/PickUpDeliveryToggle";
import {Listing} from "@/src/types/api/listing/model";

interface ListingsBottomSheetProps {
    isPickup: boolean;
    setIsPickup: (isPickup: boolean) => void;
    listings: Listing[];
    deliveryAvailable: boolean;
    pickupAvailable: boolean;
}

const ListingsBottomSheet: React.FC<ListingsBottomSheetProps> = ({
                                                                     isPickup,
                                                                     setIsPickup,
                                                                     listings,
                                                                     deliveryAvailable,
                                                                     pickupAvailable
                                                                 }) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    // These are your bottom sheet heights (snap points)
    const snapPoints = useMemo(() => ['30%', '30%', '80%'], []);


    return (


        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            style={styles.bottomSheet}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            handleIndicatorStyle={styles.bottomSheetHandle}
        >
            <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <PickupDeliveryToggle isPickup={isPickup} setIsPickup={setIsPickup}
                                          pickupAvailable={pickupAvailable}
                                          deliveryAvailable={deliveryAvailable}
                    />

                </View>
                <ListingCard listingList={listings}
                             isPickup={isPickup}

                />
            </BottomSheetScrollView>
        </BottomSheet>


    );
};

export default ListingsBottomSheet;

const styles = StyleSheet.create({

    bottomSheet: {
        zIndex: 3,
    },
    bottomSheetContent: {
        padding: 16,
    },
    bottomSheetHandle: {
        backgroundColor: '#ccc',
        width: 40,
        height: 5,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginVertical: 8,
    },


});
