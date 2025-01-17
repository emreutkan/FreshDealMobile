import React from 'react';
import {Text, TouchableOpacity, View,} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@/src/redux/store";
import {RootState} from "@/src/types/store";

import {selectDeliveryMethod, setDeliveryMethod} from "@/src/redux/slices/restaurantSlice";


export const PickupDeliveryToggle: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {isPickup} = useSelector(selectDeliveryMethod);
    const restaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
    const handleMethodChange = (newIsPickup: boolean) => {
        dispatch(setDeliveryMethod(newIsPickup));
    };

    if (restaurant.pickup && restaurant.delivery) {
        return (
            <View style={{
                flexDirection: "column",
                justifyContent: "center",
                // marginVertical: 2,
                alignItems: "center",
                alignSelf: "center",

                // width: "60%",
                width: "25%",
                gap: 6,
                borderRadius: 25,
                // padding: 4,
                // backgroundColor: "#F5F5F5",
                marginRight: 10,
                paddingBottom: 10,
            }}>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignSelf: "center",

                        padding: 8,
                        backgroundColor: isPickup ? "#333" : "#F5F5F5",
                        borderRadius: 20,
                    }}
                    onPress={() => handleMethodChange(true)}
                >

                    <Text style={{fontSize: 16, color: isPickup ? "#F5F5F5" : "#333",}}> Pick Up </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignSelf: "center",

                        padding: 8,
                        backgroundColor: isPickup ? "#F5F5F5" : "#333",
                        borderRadius: 20,
                    }}
                    onPress={() => handleMethodChange(false)}


                >

                    <Text style={{fontSize: 16, color: isPickup ? "#333" : "#FFF",}}> Delivery </Text>
                </TouchableOpacity>
            </View>
        );
    } else if (restaurant.pickup) {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "center",
                    padding: 8,
                    backgroundColor: "#333",
                    borderRadius: 20,
                    width: "20%",
                    justifyContent: "center",
                }} onPress={() => handleMethodChange(true)}>
                {/*<Ionicons name={"walk-outline"} size={scaleFont(20)} color={"#FFF"}/>*/}
                <Text style={{
                    fontSize: 16,
                    fontFamily: "Poppins-Regular",

                    color: "#FFF",
                }}> Pick Up </Text>
            </TouchableOpacity>
        );
    } else if (restaurant.delivery) {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "center",
                    padding: 8,
                    backgroundColor: "#333",
                    borderRadius: 20,
                    width: "60%",
                    justifyContent: "center",
                }} onPress={() => handleMethodChange(false)}>
                <Ionicons name={"bicycle-outline"} size={20} color={"#FFF"}/>
                <Text style={{
                    fontSize: 16, color: "#FFF", fontFamily: "Poppins-Regular",
                }}> Delivery </Text>
            </TouchableOpacity>
        );
    }

};

export default PickupDeliveryToggle;

