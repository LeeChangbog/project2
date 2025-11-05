/**
 * 홈 화면 (메인 화면)
 * - 앱 진입 시 처음 보이는 화면
 * - '사주 궁합 보기' 버튼으로 입력 화면으로 이동
 * - 사주풀이 결과 예시와 '살'에 대한 설명 표시
 */
import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <ThemedView style={styles.container}>
      {/* 상단 헤더: '사주문어' 앱 이름 표시, 로그인/회원가입 버튼 */}
      <AppHeader showHomeButton={false} showAuthButtons={true} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 앱 제목 */}
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">사주 궁합</ThemedText>
          </ThemedView>

          {/* 메인 버튼: 입력 화면으로 이동 */}
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: tintColor }]}
              onPress={() => router.push('/input')}>
              <ThemedText style={styles.buttonText}>사주 궁합 보기</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* 예시 섹션: 결과 예시와 설명 */}
          <ThemedView style={styles.exampleSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              사주풀이 결과 예시
            </ThemedText>
            {/* 예시 결과 박스 */}
            <ThemedView style={styles.exampleBox}>
              <ThemedView style={styles.exampleScore}>
                <ThemedText type="title" style={styles.scoreText}>85점</ThemedText>
                <ThemedText style={styles.scoreLabel}>궁합 점수</ThemedText>
              </ThemedView>
              <ThemedView style={styles.exampleGraph}>
                <ThemedText style={styles.exampleDescription}>
                  팔각형 방사형 그래프로 감점 요소를 표시합니다
                </ThemedText>
              </ThemedView>
            </ThemedView>

            {/* '살'에 대한 설명 */}
            <ThemedView style={styles.salExplanation}>
              <ThemedText type="subtitle" style={styles.explanationTitle}>
                감점요소 '살'이란?
              </ThemedText>
              <ThemedText style={styles.explanationText}>
                사주에서 '살'은 상호간의 충돌이나 갈등을 나타내는 요소입니다.{'\n'}
                각종 살(형살, 충살, 파살 등)이 많을수록 궁합 점수가 낮아집니다.
              </ThemedText>
            </ThemedView>
          </ThemedView>
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
    flex: 1,
    padding: 20,
    gap: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  primaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    minWidth: 220,
    alignItems: 'center',
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  exampleSection: {
    gap: 20,
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  exampleBox: {
    borderWidth: 2,
    borderColor: '#D4C4B0',
    borderRadius: 20,
    padding: 24,
    gap: 20,
    backgroundColor: '#FFF8F0',
    shadowColor: '#E8D5C4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    ...Platform.select({
      web: {
        borderColor: '#D4C4B0',
        boxShadow: '0 2px 8px rgba(232, 213, 196, 0.2)',
      },
      default: {
        borderColor: '#D4C4B0',
      },
    }),
  },
  exampleScore: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  scoreText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#A0522D',
    letterSpacing: 2,
  },
  scoreLabel: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.8,
    color: '#8B6F47',
  },
  exampleGraph: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  exampleDescription: {
    textAlign: 'center',
    lineHeight: 24,
    color: '#6B5B47',
  },
  salExplanation: {
    marginTop: 10,
    padding: 24,
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    ...Platform.select({
      web: {
        backgroundColor: '#FFF8F0',
        boxShadow: '0 2px 6px rgba(232, 213, 196, 0.15)',
      },
      default: {
        backgroundColor: '#FFF8F0',
      },
    }),
  },
  explanationTitle: {
    marginBottom: 12,
    color: '#8B6F47',
  },
  explanationText: {
    lineHeight: 26,
    fontSize: 15,
    color: '#6B5B47',
  },
});
