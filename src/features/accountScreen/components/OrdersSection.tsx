import React from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/utils/navigation';

interface OrdersSectionProps {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({navigation}) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 50,
            bounciness: 5
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 5
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.orderSection,
                {transform: [{scale: scaleAnim}]}
            ]}
        >
            <View style={styles.sectionHeader}>
                <Ionicons name="receipt-outline" size={20} color="#50703C"/>
                <Text style={styles.sectionTitle}>Your Orders</Text>
            </View>

            <TouchableOpacity
                style={styles.orderItem}
                onPress={() => navigation.navigate('Orders', {status: 'active'})}
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <View style={styles.itemContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="time-outline" size={22} color="#50703C"/>
                    </View>
                    <View style={styles.textContent}>
                        <Text style={styles.itemTitle}>Order History</Text>
                        <Text style={styles.itemSubtitle}>View active and previous orders</Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#50703C"/>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    orderSection: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        marginLeft: 8,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(80, 112, 60, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Medium',
    },
    itemSubtitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
        fontFamily: 'Poppins-Regular',
    },
});

export default OrdersSection;