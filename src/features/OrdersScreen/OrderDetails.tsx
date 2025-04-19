import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '@/src/utils/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {fetchOrderDetailsAsync} from "@/src/redux/thunks/purchaseThunks";
import {addRestaurantCommentThunk} from "@/src/redux/thunks/restaurantThunks";
import {BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import axios from "axios";
import {API_BASE_URL} from "@/src/redux/api/API";
import {LinearGradient} from "expo-linear-gradient";


type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

const POSITIVE_BADGES = [
    {
        id: 'fresh',
        name: 'Fresh',
        icon: 'food-apple',
        description: 'Food was fresh and high quality'
    },
    {
        id: 'fast_delivery',
        name: 'Fast Delivery',
        icon: 'truck-fast',
        description: 'Delivery was quick and on time'
    },
    {
        id: 'customer_friendly',
        name: 'Customer Friendly',
        icon: 'emoticon-happy-outline',
        description: 'Great customer service'
    }
];

const NEGATIVE_BADGES = [
    {
        id: 'not_fresh',
        name: 'Not Fresh',
        icon: 'food-off',
        description: 'Food quality was below expectations'
    },
    {
        id: 'slow_delivery',
        name: 'Slow Delivery',
        icon: 'truck-delivery',
        description: 'Delivery took longer than expected'
    },
    {
        id: 'not_customer_friendly',
        name: 'Poor Service',
        icon: 'emoticon-sad-outline',
        description: 'Customer service was unsatisfactory'
    }
];

const OrderDetails: React.FC = () => {
    const route = useRoute<OrderDetailsRouteProp>();
    const dispatch = useDispatch<AppDispatch>();
    const insets = useSafeAreaInsets();
    const {orderId} = route.params;
    const {currentOrder, loadingCurrentOrder} = useSelector(
        (state: RootState) => state.purchase
    );
    const [uploadProgress, setUploadProgress] = useState(0);
    const token = useSelector((state: RootState) => state.user.token);

    const [rating, setRating] = useState<number>(0.0);
    const [comment, setComment] = useState<string>('');
    const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
    const [reportImage, setReportImage] = useState<string | null>(null);
    const [reportComment, setReportComment] = useState('');
    const [headerScrollAnim] = useState(new Animated.Value(0));

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const handlePresentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCloseModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleBadgeToggle = (badgeId: string) => {
        setSelectedBadges(prevBadges => {
            if (prevBadges.includes(badgeId)) {
                return prevBadges.filter(id => id !== badgeId);
            } else {
                return [...prevBadges, badgeId];
            }
        });
    };

    const handleSubmitReport = async () => {
        if (!currentOrder || !reportComment.trim() || !reportImage) {
            Alert.alert('Error', 'Please provide both an image and description of the issue');
            return;
        }

        try {
            const fileInfo = await FileSystem.getInfoAsync(reportImage);
            if (!fileInfo.exists) {
                Alert.alert('Error', 'Selected file does not exist');
                return;
            }

            const filename = reportImage.split('/').pop() || 'report.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            const formData = new FormData();
            formData.append('purchase_id', currentOrder.purchase_id.toString());
            formData.append('description', reportComment.trim());
            formData.append('image', {
                uri: Platform.OS === 'ios' ? reportImage.replace('file://', '') : reportImage,
                name: filename,
                type: type
            } as any);

            console.log('Submitting report with:', {
                purchase_id: currentOrder.purchase_id,
                description: reportComment.trim(),
                imageUri: reportImage,
                filename,
                type
            });

            const response = await axios.post(`${API_BASE_URL}/report`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response:', response.data);

            Alert.alert(
                'Success',
                'Your report has been submitted successfully',
                [{text: 'OK', onPress: handleCloseModal}]
            );

            setReportImage(null);
            setReportComment('');
            setUploadProgress(0);

        } catch (error: any) {
            console.error('Report submission error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            Alert.alert(
                'Error',
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to submit report'
            );
            setUploadProgress(0);
        }
    };

    const handleSubmitRating = () => {
        if (currentOrder?.restaurant?.id && rating > 0) {
            dispatch(addRestaurantCommentThunk({
                restaurantId: currentOrder.restaurant.id,
                commentData: {
                    comment: comment.trim() || ' ',
                    rating: rating,
                    purchase_id: currentOrder.purchase_id,
                    badge_names: selectedBadges.length > 0 ? selectedBadges : undefined
                }
            }))
                .unwrap()
                .then(() => {
                    Alert.alert(
                        'Success',
                        'Thank you for your rating!',
                        [{text: 'OK'}]
                    );
                    setRating(0);
                    setComment('');
                    setSelectedBadges([]);
                })
                .catch((error) => {
                    Alert.alert(
                        error.data?.message || "You have already rated this restaurant",
                    );
                    console.error('Rating submission error:', error);
                });
        }
    };

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photo library to upload images.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const selectedAsset = result.assets[0];
                setReportImage(selectedAsset.uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert(
                'Error',
                'Failed to select image. Please try again.'
            );
        }
    };

    useEffect(() => {
        if (rating > 0) {
            setSelectedBadges([]);
        }
    }, [rating]);

    const RatingStars = () => {
        return (
            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        style={styles.starButton}
                        onPress={() => setRating(star)}
                    >
                        <Ionicons
                            name={rating >= star ? "star" : "star-outline"}
                            size={32}
                            color={rating >= star ? "#FFD700" : "#CCCCCC"}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const BadgeSelector = () => {
        const currentBadges = rating >= 3 ? POSITIVE_BADGES : NEGATIVE_BADGES;

        return (
            <View style={styles.badgeSelectorContainer}>
                <Text style={styles.badgeSelectorTitle}>
                    {rating >= 3
                        ? "What did you like about your order?"
                        : "What issues did you experience?"}
                </Text>
                <View style={styles.badgesGrid}>
                    {currentBadges.map((badge) => (
                        <TouchableOpacity
                            key={badge.id}
                            style={[
                                styles.badgeItem,
                                selectedBadges.includes(badge.id) &&
                                (rating >= 3 ? styles.positiveBadgeSelected : styles.negativeBadgeSelected)
                            ]}
                            onPress={() => handleBadgeToggle(badge.id)}
                        >
                            <View style={[
                                styles.badgeIconContainer,
                                rating >= 3 ? styles.positiveBadgeIcon : styles.negativeBadgeIcon
                            ]}>
                                <MaterialCommunityIcons
                                    name={badge.icon}
                                    size={28}
                                    color={selectedBadges.includes(badge.id) ? "#FFFFFF" : (rating >= 3 ? "#50703C" : "#D32F2F")}
                                />
                            </View>
                            <Text style={[
                                styles.badgeName,
                                selectedBadges.includes(badge.id) && styles.badgeNameSelected,
                                !selectedBadges.includes(badge.id) && rating < 3 && styles.negativeBadgeName
                            ]}>
                                {badge.name}
                            </Text>
                            <Text style={[
                                styles.badgeDescription,
                                selectedBadges.includes(badge.id) && styles.badgeDescriptionSelected,
                                !selectedBadges.includes(badge.id) && rating < 3 && styles.negativeBadgeDescription
                            ]} numberOfLines={2}>
                                {badge.description}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    const ReportButton = () => {
        if (currentOrder?.status === 'COMPLETED') {
            return (
                <TouchableOpacity
                    style={styles.reportButton}
                    onPress={handlePresentModal}
                >
                    <MaterialIcons name="report-problem" size={24} color="#FF6B6B"/>
                </TouchableOpacity>
            );
        }
        return null;
    };

    const ReportModalContent = () => (
        <BottomSheetScrollView contentContainerStyle={styles.reportModalContent}>
            <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>Report an Issue</Text>
                <TouchableOpacity style={styles.closeButtonContainer} onPress={handleCloseModal}>
                    <Ionicons name="close" size={24} color="#666"/>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.imageUploadContainer}
                onPress={pickImage}
            >
                {reportImage ? (
                    <>
                        <Image
                            source={{uri: reportImage}}
                            style={styles.uploadedImage}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.changeImageButton}
                            onPress={pickImage}
                        >
                            <Text style={styles.changeImageText}>Change Image</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <MaterialIcons name="add-photo-alternate" size={50} color="#CCCCCC"/>
                        <Text style={styles.uploadText}>Upload Image</Text>
                        <Text style={styles.uploadSubText}>Tap to choose a photo</Text>
                    </>
                )}
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Issue Description</Text>
            <TextInput
                style={styles.reportCommentInput}
                placeholder="Describe what's wrong with your order..."
                value={reportComment}
                onChangeText={setReportComment}
                multiline
                placeholderTextColor="#999"
            />

            {uploadProgress > 0 && uploadProgress < 100 && (
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, {width: `${uploadProgress}%`}]}/>
                    <Text style={styles.progressText}>{`${Math.round(uploadProgress)}%`}</Text>
                </View>
            )}

            <TouchableOpacity
                style={[
                    styles.reportSubmitButton,
                    (!reportImage || !reportComment.trim()) && styles.reportSubmitButtonDisabled
                ]}
                onPress={handleSubmitReport}
                disabled={!reportImage || !reportComment.trim() || uploadProgress > 0}
            >
                <Text style={styles.reportSubmitButtonText}>
                    {uploadProgress > 0 ? 'Uploading...' : 'Submit Report'}
                </Text>
            </TouchableOpacity>
        </BottomSheetScrollView>
    );

    const renderRatingSection = () => {
        if (!currentOrder) {
            return <GoBackIcon/>;
        }
        if (currentOrder.status === 'COMPLETED') {
            return (
                <View style={[styles.ratingSection, {paddingBottom: insets.bottom}]}>
                    <Text style={styles.sectionTitle}>
                        Share Your Experience
                    </Text>

                    <Text style={styles.ratingPrompt}>How was your order?</Text>
                    <RatingStars/>

                    {rating > 0 && <BadgeSelector/>}

                    <Text style={styles.inputLabel}>Additional Comments</Text>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Tell us more about your experience (optional)"
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            {opacity: rating > 0 ? 1 : 0.5},
                            rating < 3 && rating > 0 ? styles.submitButtonNegative : {}
                        ]}
                        onPress={handleSubmitRating}
                        disabled={rating === 0}
                    >
                        <Text style={styles.submitButtonText}>Submit Review</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    useEffect(() => {
        dispatch(fetchOrderDetailsAsync(orderId));
    }, [orderId]);

    if (loadingCurrentOrder || !currentOrder) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#50703C"/>
                <Text style={styles.loadingText}>Loading order details...</Text>
            </View>
        );
    }

    const getStatusColor = () => {
        switch (currentOrder.status) {
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

    const headerOpacity = headerScrollAnim.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const renderOrderStatus = () => {
        if (!currentOrder.completion_image_url && currentOrder.status !== 'COMPLETED') {
            return (
                <View style={styles.statusContainer}>
                    <View style={styles.statusIconContainer}>
                        <Ionicons name="hourglass-outline" size={24} color="#FFA500"/>
                    </View>
                    <Text style={styles.statusText}>
                        Waiting for restaurant to prepare and upload the food image
                    </Text>
                </View>
            );
        } else if (!currentOrder.completion_image_url && currentOrder.status === 'COMPLETED') {
            return (
                <View style={styles.statusContainer}>
                    <View style={styles.statusIconContainer}>
                        <Ionicons name="alert-circle" size={24} color="#FF0000"/>
                    </View>
                    <Text style={[styles.statusText, styles.errorText]}>
                        Backend Error: Completion image missing
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: currentOrder.completion_image_url}}
                    style={styles.completionImage}
                    // defaultSource={require('@/src/assets/images/icon.png')}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'transparent']}
                    style={styles.imageGradient}
                />
                <View style={styles.statusBadgeCompletedContainer}>
                    <Text style={styles.statusBadgeText}>
                        {currentOrder.status}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.header,
                {
                    paddingTop: insets.top,
                    backgroundColor: 'white',
                    opacity: headerOpacity,
                    borderBottomColor: 'rgba(0,0,0,0.1)',
                    borderBottomWidth: 1
                }
            ]}>
                <View style={styles.headerContent}>
                    <GoBackIcon/>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {currentOrder.listing_title}
                    </Text>
                    <ReportButton/>
                </View>
            </Animated.View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{paddingBottom: insets.bottom}}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: headerScrollAnim}}}],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
            >
                <View style={styles.headerPlaceholder}/>

                <View style={styles.heroSection}>
                    <Text style={styles.orderTitle}>{currentOrder.listing_title}</Text>

                    <View style={styles.statusBadge} backgroundColor={getStatusColor()}>
                        <Text style={styles.statusBadgeText}>
                            {currentOrder.status}
                        </Text>
                    </View>

                    <View style={styles.orderIdRow}>
                        <Text style={styles.orderId}>
                            Order #{currentOrder.purchase_id}
                        </Text>
                        <Text style={styles.orderDate}>
                            {new Date(currentOrder.purchase_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>
                </View>

                {renderOrderStatus()}

                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="information-circle-outline" size={20} color="#50703C"/>
                        <Text style={styles.sectionTitle}>Order Information</Text>
                    </View>

                    {currentOrder.restaurant && (
                        <View style={styles.detailRow}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="restaurant-outline" size={18} color="#50703C"/>
                            </View>
                            <Text style={styles.detailLabel}>Restaurant</Text>
                            <Text style={styles.detailValue}>
                                {currentOrder.restaurant.name}
                            </Text>
                        </View>
                    )}

                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="cart-outline" size={18} color="#50703C"/>
                        </View>
                        <Text style={styles.detailLabel}>Quantity</Text>
                        <Text style={styles.detailValue}>{currentOrder.quantity}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name={currentOrder.is_delivery ? "bicycle-outline" : "walk-outline"} size={18}
                                      color="#50703C"/>
                        </View>
                        <Text style={styles.detailLabel}>Order Type</Text>
                        <Text style={styles.detailValue}>
                            {currentOrder.is_delivery ? "Delivery" : "Pickup"}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="cash-outline" size={18} color="#50703C"/>
                        </View>
                        <Text style={styles.detailLabel}>Amount</Text>
                        <Text style={styles.detailValue}>
                            {currentOrder.total_price}₺
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="calendar-outline" size={18} color="#50703C"/>
                        </View>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>
                            {new Date(currentOrder.purchase_date).toLocaleString()}
                        </Text>
                    </View>
                </View>

                {currentOrder.is_delivery && (
                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="location-outline" size={20} color="#50703C"/>
                            <Text style={styles.sectionTitle}>Delivery Information</Text>
                        </View>
                        <View style={styles.addressContainer}>
                            <Text style={styles.addressText}>{currentOrder.delivery_address}</Text>
                            {currentOrder.delivery_notes && (
                                <View style={styles.notesContainer}>
                                    <Text style={styles.notesLabel}>Notes:</Text>
                                    <Text style={styles.notesText}>{currentOrder.delivery_notes}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {renderRatingSection()}
            </ScrollView>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={['75%']}
                backgroundStyle={styles.bottomSheetBackground}
                handleIndicatorStyle={styles.bottomSheetIndicator}
            >
                <ReportModalContent/>
            </BottomSheetModal>

            <View style={[styles.floatingHeader, {paddingTop: insets.top}]}>
                <GoBackIcon/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContainer: {
        flex: 1,
        paddingTop: 50
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingTop: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    headerPlaceholder: {
        height: 60,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        color: '#333',
        marginLeft: -24,
        fontFamily: 'Poppins-SemiBold',
    },
    floatingHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        zIndex: 99,
    },
    heroSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    orderTitle: {
        fontSize: 24,
        color: '#333',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 16,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
    },
    statusBadgeCompletedContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#50703C',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusBadgeText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    orderIdRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Medium',
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
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
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    detailIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(80, 112, 60, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailLabel: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Poppins-Medium',
        textAlign: 'right',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    statusIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statusText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    errorText: {
        color: '#FF0000',
    },
    imageContainer: {
        width: '100%',
        height: 220,
        marginBottom: 20,
        position: 'relative',
    },
    completionImage: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    addressContainer: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        padding: 16,
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Poppins-Regular',
        marginBottom: 8,
    },
    notesContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#50703C',
    },
    notesLabel: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Poppins-Medium',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    ratingSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    ratingPrompt: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Regular',
        marginBottom: 8,
        textAlign: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    starButton: {
        marginHorizontal: 4,
    },
    badgeSelectorContainer: {
        marginBottom: 24,
    },
    badgeSelectorTitle: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 16,
    },
    badgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    badgeItem: {
        width: '31%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    positiveBadgeSelected: {
        backgroundColor: '#50703C',
        borderColor: '#50703C',
    },
    negativeBadgeSelected: {
        backgroundColor: '#D32F2F',
        borderColor: '#D32F2F',
    },
    badgeIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    positiveBadgeIcon: {
        backgroundColor: 'rgba(80, 112, 60, 0.1)',
    },
    negativeBadgeIcon: {
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
    },
    badgeName: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
        marginBottom: 4,
    },
    negativeBadgeName: {
        color: '#D32F2F',
    },
    badgeNameSelected: {
        color: '#FFFFFF',
    },
    badgeDescription: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    negativeBadgeDescription: {
        color: 'rgba(211, 47, 47, 0.7)',
    },
    badgeDescriptionSelected: {
        color: '#FFFFFF',
    },
    inputLabel: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Regular',
        marginBottom: 8,
    },
    commentInput: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        padding: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#333',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    submitButton: {
        backgroundColor: '#50703C',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    submitButtonNegative: {
        backgroundColor: '#D32F2F',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    reportButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    bottomSheetBackground: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    bottomSheetIndicator: {
        backgroundColor: '#E0E0E0',
        width: 40,
    },
    reportModalContent: {
        padding: 20,
    },
    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    reportTitle: {
        fontSize: 20,
        color: '#333',
        fontFamily: 'Poppins-SemiBold',
    },
    closeButtonContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageUploadContainer: {
        height: 220,
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        marginBottom: 24,
        overflow: 'hidden',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
    },
    changeImageButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    changeImageText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
    },
    uploadText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins-Medium',
        marginTop: 12,
    },
    uploadSubText: {
        fontSize: 14,
        color: '#999',
        fontFamily: 'Poppins-Regular',
        marginTop: 4,
    },
    reportCommentInput: {
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        padding: 16,
        minHeight: 150,
        textAlignVertical: 'top',
        fontSize: 14,
        color: '#333',
        fontFamily: 'Poppins-Regular',
        marginBottom: 24,
    },
    progressContainer: {
        height: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        marginBottom: 24,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#50703C',
        borderRadius: 4,
    },
    progressText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
        color: '#FFFFFF',
        top: -16,
    },
    reportSubmitButton: {
        backgroundColor: '#FF6B6B',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    reportSubmitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    reportSubmitButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
});

export default OrderDetails;