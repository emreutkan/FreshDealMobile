import React, {useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {DebugMenu} from './DebugMenu';

export const DebugMenuProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [touchCount, setTouchCount] = useState(0);
    const [lastTouchTime, setLastTouchTime] = useState(0);

    const handleTouch = useCallback(() => {
        const currentTime = new Date().getTime();
        if (currentTime - lastTouchTime < 500) {
            setTouchCount(prev => prev + 1);
            if (touchCount >= 4) {
                setMenuVisible(true);
                setTouchCount(0);
            }
        } else {
            setTouchCount(1);
        }
        setLastTouchTime(currentTime);
    }, [touchCount, lastTouchTime]);

    return (
        <View style={styles.container}>
            {children}
            <TouchableOpacity
                style={styles.debugTrigger}
                onPress={handleTouch}
                activeOpacity={1}
            />
            <DebugMenu visible={menuVisible} onClose={() => setMenuVisible(false)}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    debugTrigger: {
        position: 'absolute',
        top: 50,
        right: 50,
        width: 50,
        height: 50,
        zIndex: 999,
        // Uncomment for development to see the touch area
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
    },
});