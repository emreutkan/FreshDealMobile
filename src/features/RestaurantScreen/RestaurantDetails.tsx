import React, {useState} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {Ionicons} from '@expo/vector-icons';
import RestaurantHeader from "@/src/features/RestaurantScreen/components/RestaurantHeader";
import {RootStackParamList} from "@/src/types/navigation";

const RestaurantDetails: React.FC = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetails'>>();
    const [isMapActive, setIsMapActive] = useState(false); // <-- State for toggling map or details

    if (!route.params || !route.params.restaurantId) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'red'}}>Error: Missing restaurantId.</Text>
            </View>
        );
    }

    const {restaurantId} = route.params;

    const restaurant = useSelector((state: RootState) =>
        state.restaurant.restaurantsProximity.find(r => r.id === restaurantId)
    );

    const formatWorkingHours = (start: string, end: string) => {
        return `${start} - ${end}`;
    };

    if (!restaurant) {
        return (
            <View style={styles.container}>
                <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
                    Restaurant not found.
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Pass isMapActive and setIsMapActive to the header */}
            <RestaurantHeader
                isScrolled={true}
                restaurantName={restaurant.restaurantName.toString()}
                isMapActive={isMapActive}
                onToggleMap={setIsMapActive}
            />

            <ScrollView>
                {/* Header image or fallback */}
                {restaurant?.image_url ? (
                    <Image
                        source={{uri: restaurant.image_url}}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.headerNoImage}>
                        <Text style={styles.headerTitle}>
                            {restaurant?.restaurantName || 'Restaurant'}
                        </Text>
                    </View>
                )}

                {/* Conditionally render the Details or the Location (Map) */}
                {!isMapActive && (
                    <View style={styles.content}>
                        <Text style={styles.restaurantName}>
                            {restaurant.restaurantName}
                        </Text>

                        <View style={styles.infoRow}>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={20} color="#FFD700"/>
                                <Text style={styles.rating}>
                                    {(restaurant?.rating ?? 0).toFixed(1)}
                                </Text>
                                <Text style={styles.ratingCount}>
                                    ({restaurant?.ratingCount ?? 0})
                                </Text>
                            </View>
                            <Text style={styles.separator}>•</Text>
                            <Text style={styles.distance}>
                                {(restaurant?.distance_km ?? 0).toFixed(1)} km away
                            </Text>
                        </View>

                        <View style={styles.detailsSection}>
                            <Text style={styles.sectionTitle}>Details</Text>

                            <View style={styles.detailRow}>
                                <Ionicons name="reader-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>About: {restaurant.restaurantDescription}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="restaurant-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>Category: {restaurant.category}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="time-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Hours: {formatWorkingHours(
                                    restaurant.workingHoursStart,
                                    restaurant.workingHoursEnd
                                )}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="calendar-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Open: {restaurant?.workingDays.join(', ')}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="location-outline" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Location: {restaurant?.latitude.toFixed(6)}, {restaurant?.longitude.toFixed(6)}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {isMapActive && (
                    <View style={styles.mapContainer}>
                        {/* Render your Map component here */}
                        <Text style={{textAlign: 'center', marginTop: 30, fontSize: 16}}>
                            Map goes here (Latitude: {restaurant.latitude}, Longitude: {restaurant.longitude})
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerImage: {
        width: '100%',
        height: 200,
    },
    headerNoImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 16,
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 4,
    },
    ratingCount: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    separator: {
        marginHorizontal: 8,
        color: '#666',
    },
    distance: {
        fontSize: 14,
        color: '#666',
    },
    detailsSection: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    mapContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RestaurantDetails;
