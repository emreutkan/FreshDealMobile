import React from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const CartBar: React.FC = () => {
    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.9} // Reduces the opacity change when pressed
        >
            <View style={styles.contentContainer}>
                <Ionicons name="cart-outline" size={24} color="#ffffff"/>
                <Text style={styles.text}>View Cart</Text>

            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        backgroundColor: '#50703CFF', // Lighter green background
        paddingVertical: 16,
        borderRadius: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#50703CFF', // Subtle border
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    text: {
        color: '#ffffff', // Darker green for better contrast
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },

});

export default CartBar;