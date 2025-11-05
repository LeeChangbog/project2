/**
 * AI 조언 화면
 * - 궁합 결과를 기반으로 AI의 조언을 표시
 * - 로딩 상태 표시
 * - 조언 내용 표시
 */
import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useUserData } from '@/contexts/UserDataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AIAdviceResponse, getAIAdvice } from '@/utils/aiService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function AIAdviceScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const { user1, user2, compatibilityResult } = useUserData();

  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<AIAdviceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // AI 조언 가져오기
    const fetchAdvice = async () => {
      if (!compatibilityResult) {
        setError('궁합 결과가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const adviceData = await getAIAdvice({
          score: compatibilityResult.score,
          explanation: compatibilityResult.explanation,
          salAnalysis: compatibilityResult.salAnalysis,
          user1,
          user2,
          saju1: compatibilityResult.saju1,
          saju2: compatibilityResult.saju2,
        });

        setAdvice(adviceData);
      } catch (err) {
        console.error('AI 조언 가져오기 실패:', err);
        setError('AI 조언을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [compatibilityResult, user1, user2]);

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="AI 조언" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {loading ? (
            // 로딩 상태
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={tintColor} />
              <ThemedText type="subtitle" style={styles.loadingText}>
                AI가 조언을 생성하고 있습니다...
              </ThemedText>
            </ThemedView>
          ) : error ? (
            // 오류 상태
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
          ) : advice ? (
            // 조언 표시
            <>
              {/* 요약 */}
              {advice.summary && (
                <ThemedView style={styles.summarySection}>
                  <ThemedText type="subtitle" style={styles.sectionTitle}>
                    요약
                  </ThemedText>
                  <ThemedText style={styles.summaryText}>{advice.summary}</ThemedText>
                </ThemedView>
              )}

              {/* 전체 조언 */}
              <ThemedView style={styles.adviceSection}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  AI 조언
                </ThemedText>
                <ThemedText style={styles.adviceText}>{advice.advice}</ThemedText>
              </ThemedView>

              {/* 구체적인 팁 */}
              {advice.tips && advice.tips.length > 0 && (
                <ThemedView style={styles.tipsSection}>
                  <ThemedText type="subtitle" style={styles.sectionTitle}>
                    구체적인 조언
                  </ThemedText>
                  {advice.tips.map((tip, index) => (
                    <ThemedView key={index} style={styles.tipItem}>
                      <ThemedText style={styles.tipBullet}>•</ThemedText>
                      <ThemedText style={styles.tipText}>{tip}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              )}

              {/* 확인 버튼 */}
              <TouchableOpacity
                style={[styles.completeButton, { backgroundColor: tintColor }]}
                onPress={() => router.back()}>
                <ThemedText style={styles.completeButtonText}>확인 완료</ThemedText>
              </TouchableOpacity>
            </>
          ) : null}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
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
    alignItems: 'center',
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
  summarySection: {
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(232, 213, 196, 0.2)',
      },
    }),
  },
  adviceSection: {
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(232, 213, 196, 0.2)',
      },
    }),
  },
  tipsSection: {
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(232, 213, 196, 0.2)',
      },
    }),
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#8B6F47',
    fontSize: 18,
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B5B47',
    fontWeight: '600',
  },
  adviceText: {
    fontSize: 15,
    lineHeight: 26,
    color: '#6B5B47',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  tipBullet: {
    fontSize: 18,
    color: '#A0522D',
    fontWeight: 'bold',
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: '#6B5B47',
  },
  completeButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#8B6F47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(139, 111, 71, 0.3)',
      },
    }),
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

