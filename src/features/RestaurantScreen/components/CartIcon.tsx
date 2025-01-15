import React from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {Ionicons} from "@expo/vector-icons";

interface CartIconProps {
    restaurantId: string;
    isPickup: boolean;
    setIsPickup: (pickup: boolean) => void;
}

const CartIcon: React.FC<CartIconProps> = ({restaurantId, isPickup, setIsPickup}) => {

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();


    return (
        <TouchableOpacity

            onPress={() => navigation.navigate('Cart', {restaurantId, isPickup, setIsPickup})}
            style={{padding: scaleFont(8)}}>

            <Ionicons name="cart-outline" size={scaleFont(24)} color="#000"/>
        </TouchableOpacity>
    );
}

export default CartIcon;