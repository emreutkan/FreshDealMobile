import React from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const CartIcon: React.FC = () => {

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();


    return (
        <TouchableOpacity

            onPress={() => navigation.navigate('Cart')}
            style={{padding: 8}}>

            <Ionicons name="cart-outline" size={24} color="green"/>
        </TouchableOpacity>
    );
}

export default CartIcon;

