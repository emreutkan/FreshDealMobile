import React, {useEffect, useRef} from 'react';
import {Animated, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {Purchase} from "@/src/types/api/purchase/model";
import {lightHaptic} from "@/src/utils/Haptics";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RecentOrderToastProps {
    order: Purchase;
    onDismiss: () => void;
}

const RecentOrderToast: React.FC<RecentOrderToastProps> = ({order, onDismiss}) => {
    const navigation = useNavigation<NavigationProp>();
    const translateY = useRef(new Animated.Value(100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        lightHaptic();
        // Slide up and fade in
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto dismiss after 5 seconds
        const timer = setTimeout(() => {
            // dismissToast();
        }, 15000);

        return () => clearTimeout(timer);
    }, []);

    const dismissToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDismiss();
        });
    };

    const handlePress = () => {
        navigation.navigate('OrderDetails', {orderId: order.purchase_id});
        dismissToast();
    };

    const getStatusColor = () => {
        switch (order.status.toUpperCase()) {
            case 'PENDING':
                return '#856404';
            case 'ACCEPTED':
                return '#155724';
            case 'COMPLETED':
                return '#50703C';
            case 'REJECTED':
                return '#721C24';
            default:
                return '#383D41';
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{translateY}],
                    opacity,
                },
            ]}
        >
            <TouchableOpacity style={styles.content} onPress={handlePress}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="receipt" size={24} color="#50703C"/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Order Placed Successfully!</Text>
                    <Text style={styles.subtitle}>{order.listing_title}</Text>
                    <Text style={[styles.status, {color: getStatusColor()}]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                    </Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={dismissToast}>
                    <MaterialIcons name="close" size={20} color="#666"/>
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: '#50703C',
        borderWidth: 1,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        // marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),

    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
        fontFamily: 'Poppins-Regular',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
    status: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
    closeButton: {
        padding: 4,
    },
});

export default RecentOrderToast;