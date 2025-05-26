import React from 'react';
import {Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View,} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';

const ReportModalContent = ({
                                reportImage,
                                reportComment,
                                setReportComment,
                                pickImage,
                                handleCloseModal,
                                handleSubmitReport,
                                uploadProgress,
                                styles
                            }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1}}>
            <BottomSheetScrollView
                contentContainerStyle={styles.reportModalContent}
                keyboardShouldPersistTaps="always"
            >
                <View style={styles.reportHeader}>
                    <Text style={styles.reportTitle}>Report an Issue</Text>
                    <TouchableOpacity style={styles.closeButtonContainer} onPress={handleCloseModal}>
                        <Ionicons name="close" size={24} color="#666"/>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.imageUploadContainer}
                    onPress={pickImage}
                >
                    {reportImage ? (
                        <>
                            <Image
                                source={{uri: reportImage}}
                                style={styles.uploadedImage}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={styles.changeImageButton}
                                onPress={pickImage}
                            >
                                <Text style={styles.changeImageText}>Change Image</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <MaterialIcons name="add-photo-alternate" size={50} color="#CCCCCC"/>
                            <Text style={styles.uploadText}>Upload Image</Text>
                            <Text style={styles.uploadSubText}>Tap to choose a photo</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.inputLabel}>Issue Description</Text>
                <TextInput
                    style={styles.reportCommentInput}
                    placeholder="Describe what's wrong with your order..."
                    value={reportComment}
                    onChangeText={setReportComment}
                    multiline={true}
                    numberOfLines={6}
                    placeholderTextColor="#999"
                    textAlignVertical="top"
                    autoCapitalize="sentences"
                />

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, {width: `${uploadProgress}%`}]}/>
                        <Text style={styles.progressText}>{`${Math.round(uploadProgress)}%`}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[
                        styles.reportSubmitButton,
                        (!reportImage || !reportComment.trim()) && styles.reportSubmitButtonDisabled
                    ]}
                    onPress={handleSubmitReport}
                    disabled={!reportImage || !reportComment.trim() || uploadProgress > 0}
                >
                    <Text style={styles.reportSubmitButtonText}>
                        {uploadProgress > 0 ? 'Uploading...' : 'Submit Report'}
                    </Text>
                </TouchableOpacity>
            </BottomSheetScrollView>
        </View>
    </TouchableWithoutFeedback>
);

export default React.memo(ReportModalContent);