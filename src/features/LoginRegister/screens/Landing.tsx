import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Keyboard, Platform, StatusBar, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import LoginModal from "@/src/features/LoginRegister/screens/LoginModal";
import RegisterModal from "@/src/features/LoginRegister/screens/RegisterModal";
import {useNavigation} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {RootState} from "@/src/types/store";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";

const Landing: React.FC = () => {
    const {height: screenHeight} = Dimensions.get('window');
    const [activeModal, setActiveModal] = useState<'login' | 'register'>('login');

    const imageScale = useRef(new Animated.Value(1.5)).current;
    const formHeight = useRef(new Animated.Value(0)).current;
    const formOpacity = useRef(new Animated.Value(0)).current;
    const logoPosition = useRef(new Animated.Value(0)).current; // New animated value for logo position

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

    const navigation = useNavigation<NavigationProp>();
    const {token} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (token) {
            navigation.reset({
                index: 0,
                routes: [{name: 'HomeScreen'}],
            });
        }
    }, [token]);

    useEffect(() => {
        const initialDelay = 200;
        const animationDuration = 1500;
        const initialScaleDuration = 500;

        const moveUpDistance = -screenHeight * 0.33;

        Animated.sequence([
            Animated.timing(imageScale, {
                toValue: 1.8,
                duration: initialScaleDuration,
                useNativeDriver: true
            }),

            Animated.delay(initialDelay),

            Animated.parallel([
                Animated.timing(imageScale, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true
                }),
                Animated.timing(logoPosition, {
                    toValue: moveUpDistance,
                    duration: animationDuration,
                    useNativeDriver: true
                }),
                Animated.timing(formHeight, {
                    toValue: 73,
                    duration: animationDuration,
                    useNativeDriver: false
                }),
                Animated.timing(formOpacity, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: false
                })
            ])
        ]).start();
    }, [screenHeight]);


    const animatedHeight = formHeight.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <LinearGradient
                colors={['#f0f7ed', '#ffffff']} // More subtle green to white
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 1}}
                style={styles.container}
            >
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>

                <Animated.View style={[
                    styles.logoContainer,
                    {
                        transform: [
                            {translateY: logoPosition},
                            {scale: imageScale}
                        ]
                    }
                ]}>
                    <Animated.Image
                        source={require('@/src/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>


                <Animated.View
                    style={[
                        styles.main,
                        {
                            height: animatedHeight,
                            opacity: formOpacity
                        }
                    ]}
                >

                    {activeModal === 'login' ? (
                        <LoginModal switchToRegister={() => setActiveModal('register')}/>
                    ) : (
                        <RegisterModal switchToLogin={() => setActiveModal('login')}/>
                    )}
                </Animated.View>

            </LinearGradient>
        </TouchableWithoutFeedback>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoContainer: {
        position: 'absolute',
        top: '40%',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    logo: {
        width: 150,
        height: 150,
    },
    main: {
        width: '100%',
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 5
            },
            android: {
                elevation: 10
            },
        }),
    },
});

export default Landing;