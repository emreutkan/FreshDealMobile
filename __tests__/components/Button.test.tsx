import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import Button from '../../components/Button';

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        const {getByText} = render(<Button title="Test Button" onPress={() => {
        }}/>);
        const buttonElement = getByText('Test Button');
        expect(buttonElement).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        const {getByText} = render(<Button title="Test Button" onPress={onPressMock}/>);
        const buttonElement = getByText('Test Button');

        fireEvent.press(buttonElement);
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('applies the correct styles when disabled', () => {
        const {getByTestId} = render(
            <Button
                title="Disabled Button"
                onPress={() => {
                }}
                disabled={true}
                testID="disabled-button"
            />
        );

        const buttonContainer = getByTestId('disabled-button');
        expect(buttonContainer.props.style).toMatchObject(
            expect.objectContaining({
                opacity: expect.any(Number)
            })
        );
    });

    it('renders with custom styles', () => {
        const customStyle = {backgroundColor: 'red', borderRadius: 10};
        const {getByTestId} = render(
            <Button
                title="Custom Button"
                onPress={() => {
                }}
                style={customStyle}
                testID="custom-button"
            />
        );

        const buttonContainer = getByTestId('custom-button');
        expect(buttonContainer.props.style).toMatchObject(
            expect.objectContaining(customStyle)
        );
    });
});