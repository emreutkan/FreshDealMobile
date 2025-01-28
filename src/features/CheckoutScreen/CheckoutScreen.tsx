// screens/CheckoutScreen.tsx
import React, {useEffect, useState} from 'react';
import {Alert, Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/types/store';
import {AppDispatch} from '@/src/redux/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {differenceInMinutes, format, isAfter, isBefore, setHours, setMinutes} from 'date-fns';
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import {complexHaptic, lightHaptic} from "@/src/utils/Haptics";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {createPurchaseOrderAsync, serializeAddressForDelivery} from "@/src/redux/thunks/purchaseThunks";
import {fetchCart} from "@/src/redux/thunks/cartThunks";
import {getRestaurantsByProximity} from "@/src/redux/thunks/restaurantThunks";
import CheckoutSuccess from "@/src/features/CheckoutScreen/components/CheckoutSuccess";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CheckoutScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();
    const insets = useSafeAreaInsets();

    const {
        selectedRestaurant: restaurant,
    } = useSelector((state: RootState) => ({
        selectedRestaurant: state.restaurant.selectedRestaurant,
    }));

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | null>(null);
    const [deliveryNotes, setDeliveryNotes] = useState('');
    const [isCardAdded, setIsCardAdded] = useState(false);
    const fadeAnim = new Animated.Value(0);

    // Current time handling
    const currentDate = new Date(); // Device's current time
    const currentDay = format(currentDate, 'EEEE');

    const selectedAddressId = useSelector((state: RootState) => state.address.selectedAddressId);
    const selectedAddress = useSelector((state: RootState) => state.address.addresses.find(address => address.id === selectedAddressId));
    // Working hours conversion
    const [startHours, startMinutes] = restaurant.workingHoursStart?.split(':') || ['0', '0'];
    const [endHours, endMinutes] = restaurant.workingHoursEnd?.split(':') || ['0', '0'];

    const todayStart = setHours(setMinutes(new Date(), parseInt(startMinutes)), parseInt(startHours));
    const todayEnd = setHours(setMinutes(new Date(), parseInt(endMinutes)), parseInt(endHours));


    // Time calculations
    const isWorkingDay = restaurant.workingDays.includes(currentDay);
    const minutesToOpen = differenceInMinutes(todayStart, currentDate);
    const minutesToClose = differenceInMinutes(todayEnd, currentDate);
    const hoursToOpen = Math.floor(Math.abs(minutesToOpen) / 60);
    const hoursToClose = Math.floor(Math.abs(minutesToClose) / 60);
    const minutesRemainderToOpen = Math.abs(minutesToOpen) % 60;
    const minutesRemainderToClose = Math.abs(minutesToClose) % 60;

    // Next working day calculation
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayIndex = daysOfWeek.indexOf(currentDay);
    const nextWorkingDay = restaurant.workingDays.find(day =>
        daysOfWeek.indexOf(day) > currentDayIndex
    ) || restaurant.workingDays[0];

    const {cartItems, selectedRestaurantListings} = useSelector((state: RootState) => ({
        cartItems: state.cart.cartItems,
        selectedRestaurantListings: state.restaurant.selectedRestaurantListings,
    }));
    useEffect(() => {
        dispatch(fetchCart());
        dispatch(getRestaurantsByProximity());
    }, [dispatch]);
    const ListingsInCart = selectedRestaurantListings.filter(listing => cartItems.some(cartItem => cartItem.listing_id === listing.id));
    console.log(ListingsInCart);
    const isPickup = useSelector((state: RootState) => state.restaurant.isPickup);
    const [showSuccess, setShowSuccess] = useState(false);

    const totalPickUpPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1;
        return sum + (item.pick_up_price || 0) * quantity;
    }, 0);

    const totalDeliveryPrice = ListingsInCart.reduce((sum, item) => {
        const cartItem = cartItems.find(ci => ci.listing_id === item.id);
        const quantity = cartItem?.count || 1;
        return sum + (item.delivery_price || 0) * quantity;
    }, 0);

    const currentTotal = isPickup ? totalPickUpPrice : totalDeliveryPrice;


    const handlePaymentMethodSelect = (method: 'card' | 'cash') => {
        lightHaptic().then(r => console.log(r));
        setPaymentMethod(method);
        if (method === 'card') {
            setIsCardAdded(true);
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(1000),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const handleCompletePurchase = async () => {
        if (!paymentMethod) {
            Alert.alert('Error', 'Please select a payment method');
            return;
        }

        if (!isWorkingDay || isBefore(currentDate, todayStart) || isAfter(currentDate, todayEnd)) {
            Alert.alert('Error', 'Restaurant is currently closed');
            return;
        }

        try {
            await dispatch(createPurchaseOrderAsync({
                isDelivery: !isPickup,
                notes: deliveryNotes ? deliveryNotes : " ",
            }));

            await complexHaptic();
            setShowSuccess(true); // Show success animation
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
        await complexHaptic();


    }

    const handleAnimationComplete = () => {
        navigation.reset({
            index: 0,
            routes: [{name: 'HomeScreen'}],
        })
    };

    if (showSuccess) {
        return <CheckoutSuccess onAnimationComplete={handleAnimationComplete}/>;
    }

    const renderRestaurantStatus = () => {
        if (!isWorkingDay) {
            return (
                <View style={styles.statusContainer}>
                    <MaterialIcons name="error" size={24} color="#DC2626"/>
                    <Text style={styles.errorText}>
                        Restaurant is closed today. Next open on {nextWorkingDay}
                    </Text>
                </View>
            );
        }

        const isBeforeOpening = isBefore(currentDate, todayStart);
        const isAfterClosing = isAfter(currentDate, todayEnd);

        if (isBeforeOpening) {
            return (
                <View style={[styles.statusContainer, minutesToOpen <= 120 && styles.soonContainer]}>
                    <MaterialIcons
                        name="access-time"
                        size={24}
                        color={minutesToOpen <= 120 ? "#50703C" : "#666"}
                    />
                    <Text style={[styles.statusText, minutesToOpen <= 120 && styles.soonText]}>
                        {minutesToOpen <= 120
                            ? `Opening soon (${hoursToOpen}h ${minutesRemainderToOpen}m)`
                            : `Opens at ${restaurant.workingHoursStart}`
                        }
                    </Text>
                </View>
            );
        }

        if (isAfterClosing) {
            return (
                <View style={styles.statusContainer}>
                    <MaterialIcons name="error" size={24} color="#DC2626"/>
                    <Text style={styles.errorText}>
                        Restaurant is closed. Opens {nextWorkingDay} at {restaurant.workingHoursStart}
                    </Text>
                </View>
            );
        }

        if (minutesToClose <= 120) {
            return (
                <View style={[styles.statusContainer, styles.soonContainer]}>
                    <MaterialIcons name="access-time" size={24} color="#DC2626"/>
                    <Text style={[styles.statusText, styles.closingSoonText]}>
                        Closing soon ({hoursToClose}h {minutesRemainderToClose}m)
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.statusContainer}>
                <MaterialIcons name="check-circle" size={24} color="#50703C"/>
                <Text style={styles.statusText}>
                    Open until {restaurant.workingHoursEnd}
                </Text>
            </View>
        );
    };


    return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            <View style={styles.header}>
                <GoBackIcon/>
                <Text style={styles.title}>Checkout</Text>
                <View style={{width: 32}}/>
            </View>

            <ScrollView style={styles.content}>
                {renderRestaurantStatus()}

                <View style={styles.orderSummary}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryContainer}>
                        {ListingsInCart.map(listing => (
                            <View key={listing.id} style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>
                                    {listing.title} (x{cartItems.find(ci => ci.listing_id === listing.id)?.count || 1})
                                </Text>

                            </View>
                        ))}
                        {!isPickup && restaurant && restaurant.deliveryFee && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                                <Text style={styles.summaryValue}>{restaurant.deliveryFee.toFixed(2)} TL</Text>
                            </View>
                        )}

                    </View>
                    <Text style={styles.totalAmount}>
                        TOTAL: {(currentTotal + (!isPickup ? restaurant?.deliveryFee || 0 : 0))} TL
                    </Text>
                </View>

                {!isPickup && selectedAddress && (
                    <View style={styles.deliveryAddressSection}>
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                        <View style={styles.addressCard}>
                            <MaterialIcons name="location-on" size={24} color="#50703C"/>
                            <Text style={styles.addressText}>
                                {serializeAddressForDelivery(selectedAddress)}
                            </Text>
                        </View>
                    </View>
                )}

                {!isPickup && (
                    <View style={styles.notesSection}>
                        <Text style={styles.sectionTitle}>Delivery Notes</Text>
                        <TextInput
                            style={styles.notesInput}
                            placeholder="Add delivery instructions..."
                            value={deliveryNotes}
                            onChangeText={setDeliveryNotes}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                )}

                <View style={styles.paymentSection}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    {isPickup ? (
                        <>
                            <TouchableOpacity
                                style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedPayment]}
                                onPress={() => handlePaymentMethodSelect('card')}
                            >
                                <MaterialIcons name="credit-card" size={24} color="#50703C"/>
                                <Text style={styles.paymentText}>Pay Now</Text>
                                {isCardAdded && paymentMethod === 'card' && (
                                    <MaterialIcons name="check-circle" size={24} color="#50703C"/>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.paymentOption, paymentMethod === 'cash' && styles.selectedPayment]}
                                onPress={() => handlePaymentMethodSelect('cash')}
                            >
                                <MaterialIcons name="money" size={24} color="#50703C"/>
                                <Text style={styles.paymentText}>Pay at Pickup</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedPayment]}
                            onPress={() => handlePaymentMethodSelect('card')}
                        >
                            <MaterialIcons name="credit-card" size={24} color="#50703C"/>
                            <Text style={styles.paymentText}>Credit Card</Text>
                            {isCardAdded && paymentMethod === 'card' && (
                                <MaterialIcons name="check-circle" size={24} color="#50703C"/>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        (!isWorkingDay || !paymentMethod) && styles.disabledButton
                    ]}
                    onPress={handleCompletePurchase}
                    disabled={!isWorkingDay || !paymentMethod}
                >
                    <Text style={styles.completeButtonText}>
                        Complete Purchase
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    deliveryAddressSection: {
        marginBottom: 16,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    addressText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        fontFamily: 'Poppins-Regular',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    orderSummary: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#50703C',
        fontFamily: 'Poppins-Regular',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    soonContainer: {
        backgroundColor: '#e8f5e9',
    },
    statusText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    soonText: {
        color: '#50703C',
        fontWeight: '600',
    },
    closingSoonText: {
        color: '#DC2626',
        fontWeight: '600',
    },
    errorText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#DC2626',
        fontFamily: 'Poppins-Regular',
        fontWeight: '600',
    },
    notesSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        fontFamily: 'Poppins-Regular',
    },
    notesInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontFamily: 'Poppins-Regular',
    },
    paymentSection: {
        marginBottom: 16,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    selectedPayment: {
        backgroundColor: '#e8f5e9',
        borderColor: '#50703C',
        borderWidth: 1,
    },
    paymentText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    bottomSection: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    completeButton: {
        backgroundColor: '#50703C',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    summaryContainer: {
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Poppins-Regular',
    },
    summaryValue: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
    },
});

export default CheckoutScreen;