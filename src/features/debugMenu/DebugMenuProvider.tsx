import React, {useCallback, useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
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
        <TouchableWithoutFeedback onPress={handleTouch}>
            <View style={styles.container}>
                {children}
                <DebugMenu visible={menuVisible} onClose={() => setMenuVisible(false)}/>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});