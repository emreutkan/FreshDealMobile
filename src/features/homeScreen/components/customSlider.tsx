import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Slider} from 'react-native-elements';

export default function CustomSliderExample() {
    // State to track the slider's value
    const [sliderValue, setSliderValue] = useState(5);

    // This method will be called whenever the slider value changes
    const handleValueChange = (value) => {
        setSliderValue(value);
        // Dispatch or handle the value (e.g., to change a radius) here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Search Radius: {sliderValue} km</Text>
            <Slider
                value={sliderValue}
                onValueChange={handleValueChange}
                minimumValue={1}
                maximumValue={50}
                step={1}
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                minimumTrackTintColor="#87CEEB"
                maximumTrackTintColor="#E0E0E0"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        color: '#50703C'
    },
    track: {
        height: 4,
        borderRadius: 2,
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: '#87CEEB',
        borderColor: '#FFF',
        borderWidth: 2,
        borderRadius: 10,
    },
});