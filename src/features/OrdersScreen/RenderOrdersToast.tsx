import React, {useEffect, useRef} from 'react';
import {Animated, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
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
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        lightHaptic().then(r => console.log(r));

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
            Animated.timing(progress, {
                toValue: 1,
                duration: 15000,
                useNativeDriver: false,
            })
        ]).start();

        const timer = setTimeout(() => {
            dismissToast();
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
                return '#FFC107';
            case 'ACCEPTED':
                return '#4CAF50';
            case 'COMPLETED':
                return '#50703C';
            case 'REJECTED':
                return '#F44336';
            default:
                return '#9E9E9E';
        }
    };

    const getStatusIcon = () => {
        switch (order.status.toUpperCase()) {
            case 'PENDING':
                return 'time-outline';
            case 'ACCEPTED':
                return 'checkmark-circle-outline';
            case 'COMPLETED':
                return 'checkmark-done-circle-outline';
            case 'REJECTED':
                return 'close-circle-outline';
            default:
                return 'help-circle-outline';
        }
    };

    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['100%', '0%'],
    });

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
            <TouchableOpacity style={styles.content} onPress={handlePress} activeOpacity={0.9}>
                <View style={[styles.iconContainer, {backgroundColor: `${getStatusColor()}20`}]}>
                    <Ionicons name="receipt-outline" size={24} color={getStatusColor()}/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Order Placed Successfully!</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {order.listing_title}
                    </Text>
                    <View style={styles.statusContainer}>
                        <Ionicons name={getStatusIcon()} size={14} color={getStatusColor()}/>
                        <Text style={[styles.status, {color: getStatusColor()}]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={dismissToast}>
                    <Ionicons name="close" size={20} color="#666"/>
                </TouchableOpacity>
            </TouchableOpacity>

            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {width, backgroundColor: getStatusColor()}
                    ]}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 10,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.25,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        fontFamily: 'Poppins-SemiBold',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        marginTop: 2,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    status: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        marginLeft: 4,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBarContainer: {
        height: 3,
        backgroundColor: '#E5E7EB',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    progressBar: {
        height: '100%',
    },
});

export default RecentOrderToast;