import React from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {AppDispatch} from "@/src/redux/store";
import {useDispatch} from "react-redux";


const CartIcon: React.FC = () => {

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

    const dispatch = useDispatch<AppDispatch>();

    // useEffect(async () => {
    //     const token = tokenService.getToken();
    //     await dispatch(getUsersCartItemsAPI({token}))
    // }, []);

    return (
        <TouchableOpacity

            onPress={() => navigation.navigate('Cart')}
            style={{padding: 8}}>

            <Ionicons name="cart-outline" size={24} color="green"/>
        </TouchableOpacity>
    );
}

export default CartIcon;

