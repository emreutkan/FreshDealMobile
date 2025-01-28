import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
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
import {MaterialIcons} from "@expo/vector-icons";
import {fetchOrderDetailsAsync} from "@/src/redux/thunks/purchaseThunks";
import {addRestaurantCommentThunk} from "@/src/redux/thunks/restaurantThunks";
import {BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import axios from "axios";
import {API_BASE_URL} from "@/src/redux/api/API";

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;
type MaterialIconName = keyof typeof MaterialIcons.glyphMap;


const OrderDetails: React.FC = () => {

    const getDeliveryIcon = (isDelivery: boolean): MaterialIconName => {
        return isDelivery ? 'local-shipping' : 'store' as MaterialIconName;
    };
    const route = useRoute<OrderDetailsRouteProp>();
    const dispatch = useDispatch<AppDispatch>();
    const insets = useSafeAreaInsets();
    const {orderId} = route.params;
    const {currentOrder, loadingCurrentOrder} = useSelector(
        (state: RootState) => state.purchase
    );
    const [uploadProgress, setUploadProgress] = useState(0);
    const token = useSelector((state: RootState) => state.user.token); // Add this at the top with other hooks

    const [rating, setRating] = useState<number>(0.0);
    const [comment, setComment] = useState<string>('');
    const [reportImage, setReportImage] = useState<string | null>(null);
    const [reportComment, setReportComment] = useState('');

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const handlePresentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCloseModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

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

            // Add logging
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
                mediaTypes: 'images', // Changed from 'image' to 'images'
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
    const ReportButton = () => {
        if (currentOrder?.status === 'COMPLETED') {
            return (
                <TouchableOpacity
                    style={styles.reportButton}
                    onPress={handlePresentModal}
                >
                    <MaterialIcons name="report-problem" size={24} color="#FF0000"/>
                </TouchableOpacity>
            );
        }
        return null;
    };

    const ReportModalContent = () => (
        <BottomSheetScrollView contentContainerStyle={styles.reportModalContent}>
            <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>Report an Issue</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                    <MaterialIcons name="close" size={24} color="#666"/>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.imageUploadContainer}
                onPress={pickImage}
            >
                {reportImage ? (
                    <Image
                        source={{uri: reportImage}}
                        style={styles.uploadedImage}
                        resizeMode="cover"
                    />
                ) : (
                    <>
                        <MaterialIcons name="add-photo-alternate" size={40} color="#666"/>
                        <Text style={styles.uploadText}>Upload Image</Text>
                        <Text style={styles.uploadSubText}>Tap to choose a photo</Text>
                    </>
                )}
            </TouchableOpacity>

            <TextInput
                style={styles.reportCommentInput}
                placeholder="Describe the issue..."
                value={reportComment}
                onChangeText={setReportComment}
                multiline
                placeholderTextColor="#666"
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

    const handleSubmitRating = () => {
        if (currentOrder?.restaurant?.id && rating > 0) {
            dispatch(addRestaurantCommentThunk({
                restaurantId: currentOrder.restaurant.id,
                commentData: {
                    comment: comment.trim() || ' ',
                    rating: rating,
                    purchase_id: currentOrder.purchase_id
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
                })
                .catch((error) => {
                    Alert.alert(
                        'Error',
                        'Failed to submit rating. Please try again.'
                    );
                    console.error('Rating submission error:', error);
                });
        }
    };

    const RatingStars = () => {
        return (
            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                    >
                        <MaterialIcons
                            name={rating >= star ? "star" : "star-border"}
                            size={32}
                            color={rating >= star ? "#FFD700" : "#666"}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderRatingSection = () => {
        if (!currentOrder) {
            return <GoBackIcon/>;
        }
        if (currentOrder.status === 'COMPLETED') {
            return (
                <View style={[styles.ratingSection, {paddingBottom: insets.bottom}]}>
                    <View style={styles.detailRow}>
                        <MaterialIcons name="rate-review" size={20} color="#666"/>
                        <Text style={[styles.detailText, styles.sectionTitle]}>
                            Rate your order
                        </Text>
                    </View>
                    <RatingStars/>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment (optional)"
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        placeholderTextColor="#666"
                    />
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            {opacity: rating > 0 ? 1 : 0.5}
                        ]}
                        onPress={handleSubmitRating}
                        disabled={rating === 0}
                    >
                        <Text style={styles.submitButtonText}>Submit Rating</Text>
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
            </View>
        );
    }

    const renderOrderStatus = () => {
        if (!currentOrder.completion_image_url && currentOrder.status !== 'COMPLETED') {
            return (
                <View style={styles.statusContainer}>
                    <MaterialIcons name="hourglass-empty" size={24} color="#FFA500"/>
                    <Text style={styles.statusText}>
                        Waiting for restaurant to prepare and upload the food image
                    </Text>
                </View>
            );
        } else if (!currentOrder.completion_image_url && currentOrder.status === 'COMPLETED') {
            return (
                <View style={styles.statusContainer}>
                    <MaterialIcons name="error" size={24} color="#FF0000"/>
                    <Text style={[styles.statusText, styles.errorText]}>
                        Backend Error: Completion image missing
                    </Text>
                </View>
            );
        }

        return (
            <Image
                source={{uri: currentOrder.completion_image_url}}
                style={styles.completionImage}
                defaultSource={require('@/src/assets/images/icon.png')}
            />
        );
    };

    return (
        <>
            <View style={[styles.header, {paddingTop: insets.top}]}>
                <GoBackIcon/>
                <Text style={styles.headerTitle}>Order Details</Text>
                <ReportButton/>

                <View style={styles.headerRight}/>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>{currentOrder.listing_title}</Text>

                    <View style={styles.statusSection}>
                        <View style={styles.detailRow}>
                            <MaterialIcons name="flag" size={20} color="#666"/>
                            <Text style={[
                                styles.detailText,
                                styles.statusText,
                                {color: currentOrder.status === 'COMPLETED' ? '#4CAF50' : '#FFA500'}
                            ]}>
                                Status: {currentOrder.status}
                            </Text>
                        </View>
                        {renderOrderStatus()}
                    </View>

                    <View style={styles.infoSection}>
                        {currentOrder.restaurant && (
                            <View style={styles.detailRow}>
                                <MaterialIcons name="store" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Restaurant: {currentOrder.restaurant.name}
                                </Text>
                            </View>
                        )}

                        <View style={styles.detailRow}>
                            <MaterialIcons name="receipt" size={20} color="#666"/>
                            <Text style={styles.detailText}>
                                Order ID: #{currentOrder.purchase_id}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons name="schedule" size={20} color="#666"/>
                            <Text style={styles.detailText}>
                                {new Date(currentOrder.purchase_date).toLocaleString()}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons name="shopping-cart" size={20} color="#666"/>
                            <Text style={styles.detailText}>
                                Quantity: {currentOrder.quantity}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons
                                name={getDeliveryIcon(currentOrder.is_delivery)}
                                size={20}
                                color="#666"
                            />
                            <Text style={styles.detailText}>
                                {currentOrder.is_delivery ? "Delivery Order" : "Pickup Order"}
                            </Text>
                        </View>
                    </View>

                    {currentOrder.is_delivery && (
                        <View style={styles.deliverySection}>
                            <Text style={styles.sectionTitle}>Delivery Information</Text>
                            <View style={styles.detailRow}>
                                <MaterialIcons name="location-on" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    {currentOrder.delivery_address}
                                </Text>
                            </View>
                            {currentOrder.delivery_notes && (
                                <View style={styles.detailRow}>
                                    <MaterialIcons name="note" size={20} color="#666"/>
                                    <Text style={styles.detailText}>
                                        {currentOrder.delivery_notes}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.priceSection}>
                        <Text style={styles.totalPrice}>
                            Total: {currentOrder.total_price} TL
                        </Text>
                    </View>
                    {renderRatingSection()}

                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={['75%']}
                    backgroundStyle={styles.bottomSheetBackground}
                    handleIndicatorStyle={styles.bottomSheetIndicator}
                >
                    <ReportModalContent/>
                </BottomSheetModal>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    statusSection: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    statusText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    errorText: {
        color: '#FF0000',
    },
    completionImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 8,
    },
    infoSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Poppins-Regular',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginLeft: -24,
        fontFamily: 'Poppins-Regular',
    },
    headerRight: {
        width: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        fontFamily: 'Poppins-Regular',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    deliverySection: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 12,
        paddingTop: 12,
    },
    priceSection: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 12,
        paddingTop: 12,
        alignItems: 'flex-end',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '600',
        color: '#50703C',
        fontFamily: 'Poppins-Regular',
    },
    ratingSection: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 12,
        paddingTop: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
    commentInput: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        minHeight: 80,
        textAlignVertical: 'top',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#666',
    },
    submitButton: {
        backgroundColor: '#50703C',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        fontWeight: '600',
    },
    reportButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bottomSheetBackground: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    bottomSheetIndicator: {
        backgroundColor: '#DDDDDD',
        width: 40,
    },
    reportModalContent: {
        padding: 16,
    },
    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    reportTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    imageUploadContainer: {
        height: 200,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    uploadText: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
        fontFamily: 'Poppins-Regular',
    },
    uploadSubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
    reportCommentInput: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins-Regular',
        marginBottom: 16,
    },
    reportSubmitButton: {
        backgroundColor: '#FF0000',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 32,
    },
    reportSubmitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    progressContainer: {
        height: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginVertical: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#50703C',
        borderRadius: 10,
    },
    progressText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        lineHeight: 20,
        color: '#000',
        fontFamily: 'Poppins-Regular',
    },
    reportSubmitButtonDisabled: {
        backgroundColor: '#cccccc',
    },
});

export default OrderDetails;
