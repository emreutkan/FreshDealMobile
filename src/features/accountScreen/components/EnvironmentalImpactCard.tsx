import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '@/src/types/store';
import {API_BASE_URL} from "@/src/redux/api/API";

const EnvironmentalImpactCard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [co2Data, setCO2Data] = useState({
        total_co2_avoided: 0,
        monthly_co2_avoided: 0,
        unit: 'kg CO2 equivalent'
    });

    const token = useSelector((state: RootState) => state.user.token);

    useEffect(() => {
        const fetchEnvironmentalData = async () => {
            if (!token) return;

            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/environmental/contributions`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success && response.data.data) {
                    setCO2Data(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch environmental data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnvironmentalData();
    }, [token]);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(80, 112, 60, 0.05)', 'rgba(80, 112, 60, 0.15)']}
                style={styles.gradientBackground}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            >
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Ionicons name="leaf-outline" size={20} color="#50703C"/>
                        <Text style={styles.title}>Your Environmental Impact</Text>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#50703C"/>
                    </View>
                ) : (
                    <View style={styles.content}>
                        <View style={styles.impactSection}>
                            <View style={styles.impactIconContainer}>
                                <Ionicons name="planet-outline" size={24} color="#50703C"/>
                            </View>
                            <View>
                                <Text style={styles.impactLabel}>Total CO₂ Avoided</Text>
                                <Text style={styles.impactText}>
                                    {co2Data.total_co2_avoided.toFixed(2)} kg
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider}/>

                        <View style={styles.impactSection}>
                            <View style={styles.impactIconContainer}>
                                <Ionicons name="calendar-outline" size={22} color="#50703C"/>
                            </View>
                            <View>
                                <Text style={styles.impactLabel}>Monthly CO₂ Avoided</Text>
                                <Text style={styles.impactText}>
                                    {co2Data.monthly_co2_avoided.toFixed(2)} kg
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    gradientBackground: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    loadingContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    impactSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    impactIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(80, 112, 60, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    impactLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontFamily: 'Poppins-Regular',
    },
    impactText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#50703C',
        fontFamily: 'Poppins-SemiBold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
        marginVertical: 16,
    },
});

export default EnvironmentalImpactCard;