import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import LoginModal from "@/src/features/LoginRegister/screens/LoginModal";
import RegisterModal from "@/src/features/LoginRegister/screens/RegisterModal";
import {useNavigation} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/types/navigation";

const Landing: React.FC = () => {
    const {height: screenHeight} = Dimensions.get('window');
    const isSmallScreen = screenHeight < 700;
    const [showImage, setShowImage] = useState(!isSmallScreen);
    const [activeModal, setActiveModal] = useState<'login' | 'register'>('login'); // State for switching views

    const imagePosition = useRef(new Animated.Value(isSmallScreen ? screenHeight : screenHeight / 2 - 125)).current;
    const formPosition = useRef(new Animated.Value(screenHeight)).current;
    const imageOpacity = useRef(new Animated.Value(1)).current;
    const scrollViewOpacity = useRef(new Animated.Value(0)).current;
    const imageScale = useRef(new Animated.Value(1.5)).current;

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

    const navigation = useNavigation<NavigationProp>();
    const {token} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (token) {
            navigation.reset({
                index: 0,
                routes: [{name: 'HomeScreen'}], // Replace 'HomeScreen' with your actual screen name
            });
        }
    }, [token]);

    useEffect(() => {
        const formFinalPosition = isSmallScreen ? screenHeight * 0.1 : screenHeight * 0.025;
        const animationDuration = 1500;

        const animations = Animated.parallel([
            Animated.timing(imageOpacity, {toValue: 1, duration: 500, useNativeDriver: true}),
            Animated.timing(imagePosition, {
                toValue: isSmallScreen ? screenHeight * 0.1 : 0,
                duration: animationDuration,
                useNativeDriver: true
            }),
            Animated.timing(imageScale, {toValue: 1, duration: animationDuration, useNativeDriver: true}),
            Animated.timing(formPosition, {
                toValue: formFinalPosition,
                duration: animationDuration,
                useNativeDriver: true
            }),
            Animated.timing(scrollViewOpacity, {toValue: 1, duration: animationDuration, useNativeDriver: true}),
        ]);

        const fadeOut = Animated.timing(imageOpacity, {toValue: 0, duration: animationDuration, useNativeDriver: true});

        const sequence = isSmallScreen ? Animated.sequence([animations, fadeOut]) : animations;

        const timer = setTimeout(() => {
            sequence.start(() => {
                if (isSmallScreen) setShowImage(false);
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [isSmallScreen, screenHeight]);

    return (
        <LinearGradient
            colors={['#B2F7A5', '#ecffe8']}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.container}
        >
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>

            {showImage && (
                <Animated.Image
                    source={require('@/assets/images/logo.png')}
                    style={[styles.logo, {
                        transform: [{translateY: imagePosition}, {scale: imageScale}],
                        opacity: imageOpacity
                    }]}
                    resizeMode="contain"
                />
            )}
            <Animated.View style={[styles.main, {transform: [{translateY: formPosition}], opacity: scrollViewOpacity}]}>
                {activeModal === 'login' ? (
                    <LoginModal switchToRegister={() => setActiveModal('register')}/>
                ) : (
                    <RegisterModal switchToLogin={() => setActiveModal('login')}/>
                )}
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, alignItems: 'center'},
    logo: {width: 150, height: 150, marginTop: 60},
    main: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
        ...Platform.select({
            ios: {shadowColor: '#000', shadowOffset: {width: 0, height: -3}, shadowOpacity: 0.1, shadowRadius: 5},
            android: {elevation: 10},
        }),
    },
});

export default Landing;

