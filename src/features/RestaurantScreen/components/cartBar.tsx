import React from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {Text, TouchableOpacity} from "react-native";

interface CartBarProps {
    isPickup: boolean;
    setIsPickup: (pickup: boolean) => void;
    cartItems: any;
}

const CartBar: React.FC<CartBarProps> = ({isPickup, setIsPickup, cartItems}) => {

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();


    return (
        <TouchableOpacity
            style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                right: 20,
                backgroundColor: '#b2f7a5', // You can change this color to match your branding
                paddingVertical: 15,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 5, // Add shadow for Android
                shadowColor: '#000', // Shadow for iOS
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 4,
            }}
            onPress={() => navigation.navigate('Cart', {isPickup, setIsPickup})}
        >
            <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
            }}>
                {/*{`Click to Go To Cart (${cartItems.length} item${cartItems.length > 1 ? 's' : ''})`}*/}
                Go to Cart
            </Text>
        </TouchableOpacity>
    );
}

export default CartBar;