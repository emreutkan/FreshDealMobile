import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Feather} from '@expo/vector-icons';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

// Type for flash deal restaurant
interface FlashDealRestaurant {
    id: number;
    name: string;
    image: string;
    discount_type: 'percentage' | 'amount';
    discount_value: number;
    min_spend: number;
    category: string;
    distance_km: number;
}

interface FlashDealsBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    onFloatingBadgePress: () => void;
}

// Sample data - in real app would come from backend
const SAMPLE_RESTAURANTS: FlashDealRestaurant[] = [
    {
        id: 1,
        name: "Fresh Bakery",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        discount_type: 'amount',
        discount_value: 25,
        min_spend: 100,
        category: "Baked Goods",
        distance_km: 1.2
    },
    {
        id: 2,
        name: "Green Market",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        discount_type: 'amount',
        discount_value: 50,
        min_spend: 150,
        category: "Fruits & Vegetables",
        distance_km: 0.8
    },
    {
        id: 3,
        name: "City Deli",
        image: "https://images.unsplash.com/photo-1601314002592-b8734bca6604?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        discount_type: 'amount',
        discount_value: 100,
        min_spend: 200,
        category: "Ready Meals",
        distance_km: 1.5
    },
    {
        id: 4,
        name: "Organic Store",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        discount_type: 'amount',
        discount_value: 25,
        min_spend: 100,
        category: "Organic Products",
        distance_km: 2.1
    },
    {
        id: 5,
        name: "Seafood Market",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        discount_type: 'amount',
        discount_value: 50,
        min_spend: 150,
        category: "Meat & Seafood",
        distance_km: 1.7
    }
];

const FlashDealsBottomSheet: React.FC<FlashDealsBottomSheetProps> = ({
                                                                         isVisible,
                                                                         onClose,
                                                                         onFloatingBadgePress
                                                                     }) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%', '80%'], []);
    const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
    const [isFloatingBadgeVisible, setIsFloatingBadgeVisible] = useState(false);

    // Animation for floating badge
    const badgeOpacity = useSharedValue(0);
    const badgeAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: badgeOpacity.value,
        };
    });

    useEffect(() => {
        if (isVisible) {
            bottomSheetModalRef.current?.present();
            setIsFloatingBadgeVisible(false);
            badgeOpacity.value = withTiming(0, {duration: 200});
        } else {
            bottomSheetModalRef.current?.dismiss();
        }
    }, [isVisible]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onClose]);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            onClose();
            setTimeout(() => {
                setIsFloatingBadgeVisible(true);
                badgeOpacity.value = withTiming(1, {duration: 300});
            }, 500);
        }
    }, [onClose]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderDealItem = ({item}: { item: FlashDealRestaurant }) => (
        <Pressable style={styles.dealItem}>
            <Image source={{uri: item.image}} style={styles.dealItemImage}/>
            <View style={styles.dealItemContent}>
                <View style={styles.dealItemHeader}>
                    <Text style={styles.dealItemName}>{item.name}</Text>
                    <Text style={styles.dealItemCategory}>{item.category}</Text>
                </View>
                <View style={styles.dealItemDetails}>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                            {item.discount_type === 'percentage'
                                ? `${item.discount_value}% OFF`
                                : `${item.discount_value}₺ OFF`}
                        </Text>
                    </View>
                    <Text style={styles.minSpendText}>
                        Min. spend: {item.min_spend}₺
                    </Text>
                </View>
                <View style={styles.dealItemFooter}>
                    <Text style={styles.distanceText}>{item.distance_km.toFixed(1)} km away</Text>
                    <TouchableOpacity style={styles.viewButton}>
                        <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Pressable>
    );

    return (
        <>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
                backgroundStyle={styles.bottomSheetBackground}
                handleIndicatorStyle={styles.indicator}
            >
                <View style={styles.header}>
                    <View style={styles.timerContainer}>
                        <Feather name="clock" size={18} color="#50703C" style={styles.timerIcon}/>
                        <Text style={styles.timerText}>Flash deals end in: {formatTime(timeRemaining)}</Text>
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Feather name="x" size={20} color="#666"/>
                    </TouchableOpacity>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Limited Time Offers</Text>
                    <Text style={styles.subtitle}>Exclusive deals from restaurants near you</Text>
                </View>

                <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                    <FlatList
                        data={SAMPLE_RESTAURANTS}
                        renderItem={renderDealItem}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        contentContainerStyle={styles.dealsList}
                    />
                </BottomSheetScrollView>
            </BottomSheetModal>

            {isFloatingBadgeVisible && (
                <Animated.View style={[styles.floatingBadge, badgeAnimatedStyle]}>
                    <TouchableOpacity
                        style={styles.floatingBadgeButton}
                        onPress={onFloatingBadgePress}
                    >
                        <Feather name="zap" size={16} color="#fff" style={styles.badgeIcon}/>
                        <Text style={styles.badgeText}>Flash Deals</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    indicator: {
        backgroundColor: '#D1D5DB',
        width: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F6EA',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    timerIcon: {
        marginRight: 6,
    },
    timerText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#50703C',
    },
    closeButton: {
        padding: 8,
    },
    titleContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: 22,
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#6B7280',
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
    },
    dealsList: {
        gap: 16,
    },
    dealItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    dealItemImage: {
        width: 100,
        height: '100%',
    },
    dealItemContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    dealItemHeader: {
        marginBottom: 8,
    },
    dealItemName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#111827',
    },
    dealItemCategory: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#6B7280',
    },
    dealItemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    discountBadge: {
        backgroundColor: '#50703C',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    discountText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 12,
        color: '#FFFFFF',
    },
    minSpendText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#6B7280',
    },
    dealItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    distanceText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#6B7280',
    },
    viewButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    viewButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        color: '#374151',
    },
    floatingBadge: {
        position: 'absolute',
        bottom: 80,
        right: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    floatingBadgeButton: {
        flexDirection: 'row',
        backgroundColor: '#50703C',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        alignItems: 'center',
    },
    badgeIcon: {
        marginRight: 6,
    },
    badgeText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
});

export default FlashDealsBottomSheet;