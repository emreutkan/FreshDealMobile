import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '@/src/types/store';
import {apiClient} from '@/src/services/apiClient';
import {API_BASE_URL} from '@/src/redux/api/API';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    options?: string[];
    additionalInfo?: {
        tips?: string[];
        checkout_steps?: string[];
        quick_actions?: string[];
        main_tabs?: Record<string, string>;
        addresses?: Array<{
            id: number;
            title: string;
            street: string;
            neighborhood: string;
            is_primary: boolean;
        }>;
        help_topics?: string[];
        navigation_tip?: string;
        suggestion?: string[];
        [key: string]: any;
    };
}

const ChatbotScreen: React.FC = () => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const token = useSelector((state: RootState) => state.user.token);

    // Start conversation when component mounts
    useEffect(() => {
        startConversation();
    }, []);

    const startConversation = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient.request({
                method: 'GET',
                url: '/api/chatbot/start',
                token
            });

            if (data.success) {
                const {message, options, ...additionalInfo} = data;

                setMessages([{
                    id: Date.now().toString(),
                    text: message,
                    sender: 'bot',
                    timestamp: new Date(),
                    options: options || [],
                    additionalInfo: Object.keys(additionalInfo).length > 0 ? additionalInfo : undefined
                }]);
            } else {
                setMessages([{
                    id: Date.now().toString(),
                    text: 'Sorry, I encountered an error. Please try again later.',
                    sender: 'bot',
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error(`Error connecting to ${API_BASE_URL}/api/chatbot/start:`, error);

            setMessages([{
                id: Date.now().toString(),
                text: 'Unable to connect to the chatbot service. Please check your internet connection and try again.',
                sender: 'bot',
                timestamp: new Date()
            }]);

            Alert.alert(
                'Connection Error',
                'Could not connect to the chatbot service. Please check your internet connection.',
                [{text: 'OK'}]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const data = await apiClient.request({
                method: 'POST',
                url: '/api/chatbot/ask',
                data: {query: messageText},
                token
            });

            // Handle both successful and unsuccessful responses from the API
            // as long as they contain a message
            if (data && data.message) {
                // Extract all useful information regardless of success status
                const {message, options, success, suggestion, ...additionalInfo} = data;

                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: message,
                    sender: 'bot',
                    timestamp: new Date(),
                    options: options || [],
                    additionalInfo: {
                        ...Object.keys(additionalInfo).length > 0 ? additionalInfo : {},
                        ...(suggestion ? {suggestion: [suggestion]} : {})
                    }
                };

                setMessages(prevMessages => [...prevMessages, botMessage]);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error(`Error sending message to ${API_BASE_URL}/api/chatbot/ask:`, error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I couldn\'t send your message. Please check your connection and try again.',
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionPress = (option: string) => {
        sendMessage(option);
    };

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({animated: true});
            }, 200);
        }
    }, [messages]);

    const renderMessage = ({item}: { item: Message }) => {
        return (
            <View style={[
                styles.messageContainer,
                item.sender === 'user' ? styles.userMessage : styles.botMessage
            ]}>
                <Text style={[
                    styles.messageText,
                    item.sender === 'user' ? styles.userMessageText : styles.botMessageText
                ]}>{item.text}</Text>

                {item.sender === 'bot' && item.additionalInfo && (
                    <View style={styles.additionalInfoContainer}>
                        {/* Checkout steps */}
                        {item.additionalInfo.checkout_steps && item.additionalInfo.checkout_steps.length > 0 && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>How to checkout:</Text>
                                {item.additionalInfo.checkout_steps.map((step, index) => (
                                    <View key={index} style={styles.bulletPoint}>
                                        <Text style={styles.bulletPointText}>{step}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Tips */}
                        {item.additionalInfo.tips && item.additionalInfo.tips.length > 0 && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>Tips:</Text>
                                {item.additionalInfo.tips.map((tip, index) => (
                                    <View key={index} style={styles.bulletPoint}>
                                        <Text style={styles.bulletPointText}>{tip}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Help Topics */}
                        {item.additionalInfo.help_topics && item.additionalInfo.help_topics.length > 0 && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>Help Topics:</Text>
                                {item.additionalInfo.help_topics.map((topic, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.helpTopicButton}
                                        onPress={() => handleOptionPress(topic)}
                                    >
                                        <Text style={styles.helpTopicText}>{topic}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Quick Actions */}
                        {item.additionalInfo.quick_actions && item.additionalInfo.quick_actions.length > 0 && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>Quick Actions:</Text>
                                {item.additionalInfo.quick_actions.map((action, index) => (
                                    <View key={index} style={styles.bulletPoint}>
                                        <Text style={styles.bulletPointText}>{action}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Main Tabs */}
                        {item.additionalInfo.main_tabs && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>App Navigation:</Text>
                                {Object.entries(item.additionalInfo.main_tabs).map(([tab, description], index) => (
                                    <View key={index} style={styles.tabItem}>
                                        <Text style={styles.tabName}>{tab}</Text>
                                        <Text style={styles.tabDescription}>{description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Navigation Tip */}
                        {item.additionalInfo.navigation_tip && (
                            <View style={styles.tipContainer}>
                                <Ionicons name="information-circle-outline" size={18} color="#50703C"/>
                                <Text style={styles.navigationTip}>{item.additionalInfo.navigation_tip}</Text>
                            </View>
                        )}

                        {/* Addresses */}
                        {item.additionalInfo.addresses && item.additionalInfo.addresses.length > 0 && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>Your Addresses:</Text>
                                {item.additionalInfo.addresses.map((address, index) => (
                                    <View key={index} style={styles.addressItem}>
                                        <View style={styles.addressHeader}>
                                            <Text style={styles.addressTitle}>{address.title}</Text>
                                            {address.is_primary && (
                                                <View style={styles.primaryBadge}>
                                                    <Text style={styles.primaryBadgeText}>Primary</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.addressText}>{address.street}, {address.neighborhood}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Suggestions */}
                        {item.additionalInfo.suggestion && item.additionalInfo.suggestion.length > 0 && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>Suggestions:</Text>
                                {item.additionalInfo.suggestion.map((suggestion, index) => (
                                    <View key={index} style={styles.bulletPoint}>
                                        <Text style={styles.bulletPointText}>{suggestion}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Generic array data that hasn't been handled specifically */}
                        {Object.entries(item.additionalInfo).map(([key, value]) => {
                            // Skip already rendered sections and non-array values
                            if (
                                key === 'checkout_steps' ||
                                key === 'tips' ||
                                key === 'help_topics' ||
                                key === 'quick_actions' ||
                                key === 'navigation_tip' ||
                                key === 'addresses' ||
                                key === 'main_tabs' ||
                                key === 'suggestion' ||
                                !Array.isArray(value)
                            ) return null;

                            return (
                                <View key={key} style={styles.infoSection}>
                                    <Text style={styles.infoSectionTitle}>{key.replace(/_/g, ' ')}:</Text>
                                    {value.map((item, index) => (
                                        <View key={index} style={styles.bulletPoint}>
                                            <Text style={styles.bulletPointText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Options buttons if provided by the bot */}
                {item.sender === 'bot' && item.options && item.options.length > 0 && (
                    <View style={styles.optionsContainer}>
                        {item.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.optionButton}
                                onPress={() => handleOptionPress(option)}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    const handleRetry = () => {
        if (messages.length === 0 || (messages.length === 1 && messages[0].text.includes('Unable to connect'))) {
            startConversation();
        } else {
            sendMessage("Hello");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chatbot Assistant</Text>
                {messages.length > 0 && (
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={handleRetry}
                        disabled={isLoading}
                    >
                        <Ionicons name="refresh" size={24} color="#50703C"/>
                    </TouchableOpacity>
                )}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                {messages.length === 0 && isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#50703C"/>
                        <Text style={styles.loadingText}>Connecting to chatbot...</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.messagesContainer}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type your message..."
                        placeholderTextColor="#999"
                        returnKeyType="send"
                        onSubmitEditing={() => sendMessage(inputText)}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.disabledButton]}
                        onPress={() => sendMessage(inputText)}
                        disabled={!inputText.trim() || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF"/>
                        ) : (
                            <Ionicons name="send" size={20} color="#FFFFFF"/>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 4,
    },
    refreshButton: {
        padding: 4,
        marginLeft: 'auto',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 16,
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#666',
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    messageContainer: {
        maxWidth: '80%',
        marginBottom: 12,
        padding: 12,
        borderRadius: 18,
        elevation: 1,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#50703C',
        borderTopRightRadius: 2,
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 2,
    },
    messageText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    botMessageText: {
        color: '#333333',
    },
    optionsContainer: {
        marginTop: 10,
    },
    optionButton: {
        backgroundColor: '#f0f4ea',
        padding: 10,
        borderRadius: 20,
        marginTop: 8,
    },
    optionText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#50703C',
        textAlign: 'center',
    },
    additionalInfoContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    infoSection: {
        marginBottom: 10,
    },
    infoSectionTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#50703C',
        marginBottom: 5,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginVertical: 3,
        paddingLeft: 5,
    },
    bulletPointText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#333',
    },
    helpTopicButton: {
        backgroundColor: '#f0f4ea',
        padding: 10,
        borderRadius: 20,
        marginTop: 8,
    },
    helpTopicText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#50703C',
        textAlign: 'center',
    },
    tabItem: {
        marginVertical: 5,
    },
    tabName: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#50703C',
    },
    tabDescription: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#333',
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    navigationTip: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#333',
        marginLeft: 5,
    },
    addressItem: {
        marginVertical: 5,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#50703C',
    },
    primaryBadge: {
        backgroundColor: '#50703C',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 8,
    },
    primaryBadgeText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#FFFFFF',
    },
    addressText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginRight: 8,
    },
    sendButton: {
        width: 44,
        height: 44,
        backgroundColor: '#50703C',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#A0AFA0',
    }
});

export default ChatbotScreen;
