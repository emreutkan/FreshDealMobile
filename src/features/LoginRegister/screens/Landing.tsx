import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet,} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import LoginModal from "@/src/features/LoginRegister/screens/LoginModal";
import RegisterModal from "@/src/features/LoginRegister/screens/RegisterModal";

const Landing: React.FC = () => {
    const {height: screenHeight} = Dimensions.get('window');
    const isSmallScreen = screenHeight < 700;
    const [showImage, setShowImage] = useState(!isSmallScreen);
    const [activeModal, setActiveModal] = useState<'login' | 'register'>('login');
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    const imagePosition = useRef(new Animated.Value(isSmallScreen ? screenHeight : screenHeight / 2 - 125)).current;
    const formPosition = useRef(new Animated.Value(screenHeight)).current;
    const imageOpacity = useRef(new Animated.Value(1)).current;
    const scrollViewOpacity = useRef(new Animated.Value(0)).current;
    const imageScale = useRef(new Animated.Value(1.5)).current;

    // Handle animations on mount
    useEffect(() => {
        const formFinalPosition = isSmallScreen ? screenHeight * 0.1 : screenHeight * 0.025;
        const animationDuration = 1500;

        const animations = Animated.parallel([
            Animated.timing(imageOpacity, {toValue: 1, duration: 500, useNativeDriver: true}),
            Animated.timing(imagePosition, {
                toValue: isSmallScreen ? screenHeight * 0.1 : 0,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            Animated.timing(imageScale, {toValue: 1, duration: animationDuration, useNativeDriver: true}),
            Animated.timing(formPosition, {
                toValue: formFinalPosition,
                duration: animationDuration,
                useNativeDriver: true,
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

    // Handle keyboard visibility
    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardOffset(event.endCoordinates.height);
        });

        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardOffset(0);
        });

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={keyboardOffset} // Dynamically adjust view based on keyboard
        >
            <LinearGradient
                colors={['#B2F7A5', '#ecffe8']}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 1}}
                style={styles.gradientContainer}
            >
                {showImage && (
                    <Animated.Image
                        source={require('@/assets/images/logo.png')}
                        style={[
                            styles.logo,
                            {
                                transform: [{translateY: imagePosition}, {scale: imageScale}],
                                opacity: imageOpacity,
                            },
                        ]}
                        resizeMode="contain"
                    />
                )}
                <Animated.View
                    style={[
                        styles.main,
                        {
                            transform: [{translateY: formPosition}],
                            opacity: scrollViewOpacity,
                        },
                    ]}
                >
                    {activeModal === 'login' ? (
                        <LoginModal switchToRegister={() => setActiveModal('register')}/>
                    ) : (
                        <RegisterModal switchToLogin={() => setActiveModal('login')}/>
                    )}
                </Animated.View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginTop: 60,
    },
    main: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
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
