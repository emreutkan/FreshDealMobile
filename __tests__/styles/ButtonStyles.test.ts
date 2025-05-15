import {ButtonStyles} from '../../src/styles/ButtonStyles';
import {Platform} from 'react-native';

describe('Button Styles', () => {
    it('should have correct default button styles', () => {
        const defaultStyle = ButtonStyles.default;

        expect(defaultStyle.height).toBe(50);
        expect(defaultStyle.backgroundColor).toBe('#ffffff');
        expect(defaultStyle.borderRadius).toBe(12);
        expect(defaultStyle.width).toBe('100%');
        expect(defaultStyle.marginTop).toBe(14);

        // Check platform-specific shadow properties
        if (Platform.OS === 'ios') {
            expect(defaultStyle.shadowColor).toBe('#000');
            expect(defaultStyle.shadowOffset).toEqual({width: 0, height: 2});
            expect(defaultStyle.shadowOpacity).toBe(0.1);
            expect(defaultStyle.shadowRadius).toBe(4);
        } else {
            expect(defaultStyle.elevation).toBe(4);
        }
    });

    it('should have correct green button styles', () => {
        const greenButtonStyle = ButtonStyles.defaultGreenButton;

        expect(greenButtonStyle.backgroundColor).toBe('#50703C');
        expect(greenButtonStyle.height).toBe(50);
        expect(greenButtonStyle.borderRadius).toBe(12);
    });

    it('should have correct button text styles', () => {
        const textStyle = ButtonStyles.ButtonText;

        expect(textStyle.color).toBe('#000');
        expect(textStyle.fontFamily).toBe('Poppins-Regular');
        expect(textStyle.fontSize).toBe(16);
        expect(textStyle.textAlign).toBe('center');
    });
});