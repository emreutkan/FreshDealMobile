import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@/src/redux/store";
import {RootState} from "@/src/types/store";
import {selectDeliveryMethod, setDeliveryMethod} from "@/src/redux/slices/restaurantSlice";

interface DeliveryButtonProps {
    isActive: boolean;
    onPress: () => void;
    label: string;
    icon?: string;
}

const DeliveryButton: React.FC<DeliveryButtonProps> = ({isActive, onPress, label, icon}) => (
    <TouchableOpacity
        style={[
            styles.button,
            {backgroundColor: isActive ? styles.active.backgroundColor : styles.inactive.backgroundColor}
        ]}
        onPress={onPress}
    >
        {icon && <Ionicons name={icon} size={20} color={isActive ? "#FFF" : "#333"}/>}
        <Text style={[
            styles.buttonText,
            {color: isActive ? "#FFF" : "#333"}
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

interface PickupDeliveryToggleProps {
    layout?: 'row' | 'column';
}

export const PickupDeliveryToggle: React.FC<PickupDeliveryToggleProps> = ({layout = 'column'}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {isPickup} = useSelector(selectDeliveryMethod);
    const restaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);

    const handleMethodChange = (newIsPickup: boolean) => {
        dispatch(setDeliveryMethod(newIsPickup));
    };

    if (!restaurant.pickup && !restaurant.delivery) {
        return null;
    }

    if (restaurant.pickup && restaurant.delivery) {
        return (
            <View style={[
                layout === 'row' ? styles.rowContainer : styles.columnContainer
            ]}>
                <DeliveryButton
                    isActive={isPickup}
                    onPress={() => handleMethodChange(true)}
                    label="Pick Up"
                />
                <DeliveryButton
                    isActive={!isPickup}
                    onPress={() => handleMethodChange(false)}
                    label="Delivery"
                />
            </View>
        );
    }

    // Single button for pickup or delivery only
    return (
        <DeliveryButton
            isActive={true}
            onPress={() => handleMethodChange(restaurant.pickup)}
            label={restaurant.pickup ? "Pick Up" : "Delivery"}
            icon={restaurant.delivery ? "bicycle-outline" : undefined}
        />
    );
};

const styles = StyleSheet.create({
    dualButtonContainer: {},
    button: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        padding: 8,
        borderRadius: 20,
        width: 80,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
    },
    active: {
        backgroundColor: "#333",
    },
    inactive: {
        backgroundColor: "#F5F5F5",
    },
    rowContainer: {
        flexDirection: "row",

        gap: 10, // Adjust gap for row layout
    },
    columnContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        gap: 6,
        borderRadius: 25,
        marginRight: 10,
        bottom: 6
    },
});

export default PickupDeliveryToggle;