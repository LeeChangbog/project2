/**
 * AI 조언 화면 (채팅 인터페이스)
 * - 궁합 결과를 기반으로 AI의 초기 조언을 표시
 * - AI와 실시간 대화 가능
 * - 메시지 히스토리 관리
 */
import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { aiChatAPI } from '@/utils/apiClient';
import { getAIAdvice } from '@/utils/aiService';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAdviceScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const { user1, user2, compatibilityResult } = useUserData();
  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 초기 AI 조언 가져오기
  useEffect(() => {
    const fetchInitialAdvice = async () => {
      if (!compatibilityResult) {
        setError('궁합 결과가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 초기 조언 가져오기
        const adviceData = await getAIAdvice({
          score: compatibilityResult.score,
          explanation: compatibilityResult.explanation,
          salAnalysis: compatibilityResult.salAnalysis,
          user1,
          user2,
          saju1: compatibilityResult.saju1,
          saju2: compatibilityResult.saju2,
        });

        // 초기 조언을 첫 메시지로 추가
        const initialMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `안녕하세요! 궁합 결과를 분석한 조언을 드리겠습니다.\n\n${adviceData.advice}${adviceData.tips && adviceData.tips.length > 0 ? '\n\n💡 구체적인 조언:\n' + adviceData.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n') : ''}\n\n궁합에 대해 더 궁금한 점이 있으시면 언제든 물어보세요!`,
          timestamp: new Date(),
        };

        setMessages([initialMessage]);
      } catch (err) {
        console.error('AI 조언 가져오기 실패:', err);
        setError('AI 조언을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialAdvice();
  }, [compatibilityResult, user1, user2]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSending(true);
    setError(null);

    try {
      // 메시지 히스토리 구성 (시스템 메시지 제외)
      const messageHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 새 사용자 메시지 추가
      messageHistory.push({
        role: 'user',
        content: userMessage.content,
      });

      // AI 채팅 API 호출
      console.log('📤 메시지 전송 시작:', { messageCount: messageHistory.length });
      const response = await aiChatAPI.sendMessage({
        messages: messageHistory,
        compatibilityContext: compatibilityResult
          ? {
              score: compatibilityResult.score,
              explanation: compatibilityResult.explanation,
              salAnalysis: compatibilityResult.salAnalysis,
              user1,
              user2,
            }
          : undefined,
        userId: user?.id,
      });

      console.log('📥 AI 채팅 응답 받음:', { success: response.success, hasData: !!response.data });

      if (response.success && response.data?.message) {
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setError(null);
      } else {
        console.error('❌ AI 응답 형식 오류:', response);
        throw new Error(response.message || 'AI 응답을 받지 못했습니다.');
      }
    } catch (err: any) {
      console.error('❌ 메시지 전송 실패:', err);
      const errorMessage = err?.message || '메시지 전송 중 오류가 발생했습니다.';
      setError(errorMessage);
      
      // 오류 메시지 추가
      const errorMessageObj: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `죄송합니다. 오류가 발생했습니다: ${errorMessage}\n\n다시 시도해주세요.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setSending(false);
    }
  };

  // 스크롤을 맨 아래로
  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="AI 조언" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {loading ? (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tintColor} />
            <ThemedText type="subtitle" style={styles.loadingText}>
              AI가 조언을 생성하고 있습니다...
            </ThemedText>
          </ThemedView>
        ) : error && messages.length === 0 ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText type="subtitle" style={styles.errorText}>
              {error}
            </ThemedText>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: tintColor }]}
              onPress={() => router.back()}>
              <ThemedText style={styles.retryButtonText}>돌아가기</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <>
            {/* 메시지 리스트 */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageWrapper,
                    message.role === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper,
                  ]}>
                  <ThemedView
                    style={[
                      styles.messageBubble,
                      message.role === 'user'
                        ? [styles.userMessage, { backgroundColor: tintColor }]
                        : styles.aiMessage,
                    ]}>
                    <ThemedText
                      style={[
                        styles.messageText,
                        message.role === 'user' ? styles.userMessageText : styles.aiMessageText,
                      ]}>
                      {message.content}
                    </ThemedText>
                  </ThemedView>
                </View>
              ))}
              {sending && (
                <View style={[styles.messageWrapper, styles.aiMessageWrapper]}>
                  <ThemedView style={[styles.messageBubble, styles.aiMessage]}>
                    <ActivityIndicator size="small" color={tintColor} />
                    <ThemedText style={[styles.messageText, styles.aiMessageText]}>
                      AI가 입력 중...
                    </ThemedText>
                  </ThemedView>
                </View>
              )}
            </ScrollView>

            {/* 입력 영역 */}
            <ThemedView style={styles.inputContainer}>
              {error && (
                <ThemedText style={styles.errorTextSmall}>{error}</ThemedText>
              )}
              <View style={styles.inputRow}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: '#D4C4B0',
                      backgroundColor: '#FFFFFF',
                      color: colorScheme === 'dark' ? '#F5E6D3' : '#5C4033',
                    },
                  ]}
                  placeholder="메시지를 입력하세요..."
                  placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                  editable={!sending}
                  onSubmitEditing={handleSendMessage}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    { backgroundColor: tintColor },
                    (!inputText.trim() || sending) && styles.sendButtonDisabled,
                  ]}
                  onPress={handleSendMessage}
                  disabled={!inputText.trim() || sending}>
                  {sending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <ThemedText style={styles.sendButtonText}>전송</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </ThemedView>
          </>
        )}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 20,
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 20,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  userMessage: {
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: '#D4C4B0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#6B5B47',
  },
  inputContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C4',
    backgroundColor: '#FFF8F0',
    ...Platform.select({
      web: {
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  errorTextSmall: {
    color: '#D32F2F',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 44,
    maxHeight: 100,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
