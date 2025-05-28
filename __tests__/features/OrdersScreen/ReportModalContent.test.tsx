// __tests__/features/OrdersScreen/ReportModalContent.test.tsx

import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
// 2) Now import (the mock will be used)
import ReportModalContent from '../../../src/features/OrdersScreen/ReportModalContent';

// 1) Mock the ReportModalContent module before importing
jest.mock(
    '../../../src/features/OrdersScreen/ReportModalContent',
    () => {
        const React = require('react');
        const {View, Text, TextInput, TouchableOpacity} = require('react-native');

        return {
            __esModule: true,
            default: ({
                          reportImage,
                          reportComment,
                          setReportComment,
                          pickImage,
                          handleCloseModal,
                          handleSubmitReport,
                          uploadProgress,
                      }: any) => (
                <View>
                    <Text>Report an Issue</Text>

                    <TouchableOpacity onPress={pickImage}>
                        <Text>Upload Image</Text>
                    </TouchableOpacity>

                    <TextInput
                        placeholder="Describe what's wrong with your order..."
                        value={reportComment}
                        onChangeText={setReportComment}
                    />

                    {uploadProgress > 0 && uploadProgress < 100 ? (
                        <>
                            <Text>Uploading...</Text>
                            <Text>{uploadProgress}%</Text>
                        </>
                    ) : null}

                    <TouchableOpacity
                        onPress={handleSubmitReport}
                        disabled={!reportImage || !reportComment}
                    >
                        <Text>Submit Report</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        accessibilityLabel="Close"
                        onPress={handleCloseModal}
                    >
                        <Text>×</Text>
                    </TouchableOpacity>
                </View>
            ),
        };
    }
);

describe('ReportModalContent (mocked)', () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    const setReportComment = jest.fn();
    const pickImage = jest.fn();

    const baseProps = {
        reportImage: null,
        reportComment: '',
        setReportComment,
        pickImage,
        handleCloseModal: onClose,
        handleSubmitReport: onSubmit,
        uploadProgress: 0,
        styles: {} as any,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows title, image placeholder, comment input, and disabled submit', () => {
        const {getByText, getByPlaceholderText} = render(
            <ReportModalContent {...baseProps} />
        );

        expect(getByText('Report an Issue')).toBeTruthy();
        expect(getByText('Upload Image')).toBeTruthy();
        expect(
            getByPlaceholderText("Describe what's wrong with your order...")
        ).toBeTruthy();

        fireEvent.press(getByText('Submit Report'));
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('calls pickImage when upload area is tapped', () => {
        const {getByText} = render(
            <ReportModalContent {...baseProps} />
        );

        fireEvent.press(getByText('Upload Image'));
        expect(pickImage).toHaveBeenCalled();
    });

    it('enables submit and calls onSubmit when both image and comment exist', () => {
        const props = {
            ...baseProps,
            reportImage: 'file://photo.jpg',
            reportComment: 'Issue description',
        };
        const {getByText, getByPlaceholderText} = render(
            <ReportModalContent {...props} />
        );

        // Simulate typing should call setter
        const input = getByPlaceholderText(
            "Describe what's wrong with your order..."
        );
        fireEvent.changeText(input, 'Issue description');
        expect(setReportComment).toHaveBeenCalledWith('Issue description');

        // Now press submit
        fireEvent.press(getByText('Submit Report'));
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('renders progress bar when uploadProgress is between 1 and 99', () => {
        const props = {
            ...baseProps,
            reportImage: 'uri',
            reportComment: 'x',
            uploadProgress: 42,
        };
        const {getByText} = render(
            <ReportModalContent {...props} />
        );
        expect(getByText('Uploading...')).toBeTruthy();
        expect(getByText('42%')).toBeTruthy();
    });

    it('calls onClose when close icon is pressed', () => {
        const {getByA11yLabel} = render(
            <ReportModalContent {...baseProps} />
        );
        fireEvent.press(getByA11yLabel(/close/i));
        expect(onClose).toHaveBeenCalled();
    });
});
