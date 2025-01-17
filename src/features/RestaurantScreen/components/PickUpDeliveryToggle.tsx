import React from 'react';
import {Text, TouchableOpacity, View,} from 'react-native';
import {Ionicons} from "@expo/vector-icons";


interface PickupDeliveryToggleProps {

    isPickup: boolean;
    setIsPickup: (isPickup: boolean) => void;
    pickupAvailable: boolean;
    deliveryAvailable: boolean;
}


export const PickupDeliveryToggle: React.FC<PickupDeliveryToggleProps> = ({
                                                                              isPickup,
                                                                              setIsPickup,
                                                                              pickupAvailable,
                                                                              deliveryAvailable
                                                                          }) => {

    if (pickupAvailable && deliveryAvailable) {
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
                    }} onPress={() => setIsPickup(true)}>
                    {/*<Ionicons name={"walk-outline"} size={20} color={"#333"}*/}
                    {/*          style={{color: isPickup ? "#F5F5F5" : "#333",}}/>*/}
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
                    }} onPress={() => setIsPickup(false)}>
                    {/*<Ionicons name={"bicycle-outline"} size={20} color={"#F5F5F5"}*/}
                    {/*          style={{color: isPickup ? "#333" : "#FFF",}}/>*/}
                    <Text style={{fontSize: 16, color: isPickup ? "#333" : "#FFF",}}> Delivery </Text>
                </TouchableOpacity>
            </View>
        );
    } else if (pickupAvailable) {
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
                }} onPress={() => setIsPickup(true)}>
                {/*<Ionicons name={"walk-outline"} size={scaleFont(20)} color={"#FFF"}/>*/}
                <Text style={{
                    fontSize: 16,
                    fontFamily: "Poppins-Regular",

                    color: "#FFF",
                }}> Pick Up </Text>
            </TouchableOpacity>
        );
    } else if (deliveryAvailable) {
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
                }} onPress={() => setIsPickup(false)}>
                <Ionicons name={"bicycle-outline"} size={20} color={"#FFF"}/>
                <Text style={{
                    fontSize: 16, color: "#FFF", fontFamily: "Poppins-Regular",
                }}> Delivery </Text>
            </TouchableOpacity>
        );
    }

};

export default PickupDeliveryToggle;

