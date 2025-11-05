/**
 * 홈 화면 (메인 화면)
 * - 앱 진입 시 처음 보이는 화면
 * - '사주 궁합 보기' 버튼으로 입력 화면으로 이동
 * - '살'에 대한 상세한 설명 표시
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
          {/* 앱 제목 (로고 역할) */}
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">궁합문어</ThemedText>
          </ThemedView>

          {/* 메인 버튼: 입력 화면으로 이동 */}
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: tintColor }]}
              onPress={() => router.push('/input')}>
              <ThemedText style={styles.buttonText}>사주 궁합 보기</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* '살'에 대한 설명 */}
          <ThemedView style={styles.salExplanation}>
            <ThemedText type="subtitle" style={styles.explanationTitle}>
              궁합에서의 '살'이란?
            </ThemedText>
            <ThemedText style={styles.explanationText}>
              사주에서 '살'은 두 사람 간의 관계에서 나타나는 충돌, 갈등, 또는 부조화를 나타내는 요소입니다. 
              각종 살이 많을수록 궁합 점수가 낮아지며, 관계에서 어려움이 발생할 가능성이 높아집니다.
            </ThemedText>
            
            <ThemedView style={styles.salTypesContainer}>
              <ThemedText type="subtitle" style={styles.salTypeTitle}>
                주요 살의 종류
              </ThemedText>
              
              <ThemedView style={styles.salTypeItem}>
                <ThemedText style={styles.salTypeName}>• 충살 (衝殺)</ThemedText>
                <ThemedText style={styles.salTypeDescription}>
                  서로 반대되는 지지 관계로, 대립하고 충돌하는 기운입니다. 의견 차이와 갈등이 자주 발생할 수 있습니다.
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.salTypeItem}>
                <ThemedText style={styles.salTypeName}>• 형살 (刑殺)</ThemedText>
                <ThemedText style={styles.salTypeDescription}>
                  형벌 관계로, 서로를 구속하고 제압하는 기운입니다. 상호간의 충돌과 다툼을 나타냅니다.
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.salTypeItem}>
                <ThemedText style={styles.salTypeName}>• 파살 (破殺)</ThemedText>
                <ThemedText style={styles.salTypeDescription}>
                  파괴 관계로, 관계의 불안정성을 나타냅니다. 불화와 분열의 원인이 될 수 있습니다.
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.salTypeItem}>
                <ThemedText style={styles.salTypeName}>• 해살 (害殺)</ThemedText>
                <ThemedText style={styles.salTypeDescription}>
                  해로움 관계로, 서로에게 해를 끼치는 요소입니다. 신뢰 관계에 손상을 줄 수 있습니다.
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.salCombination}>
              <ThemedText type="subtitle" style={styles.salCombinationTitle}>
                조합된 살
              </ThemedText>
              <ThemedText style={styles.salCombinationText}>
                위의 4가지 기본 살이 여러 개 동시에 나타나면 조합된 살로 나타납니다. 
                예를 들어 충살과 형살이 함께 있으면 '충형살', 파살과 해살이 함께 있으면 '파해살' 등으로 표시되며, 
                이러한 조합된 살은 더 큰 감점 요인이 될 수 있습니다.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.salConclusion}>
              <ThemedText style={styles.conclusionText}>
                이러한 살들이 많을수록 궁합 점수에 감점이 적용되며, 
                실제 관계에서도 이러한 부분들을 이해하고 서로 배려하는 것이 중요합니다.
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
  salExplanation: {
    marginTop: 20,
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
    marginBottom: 16,
    color: '#8B6F47',
    fontSize: 20,
    fontWeight: '700',
  },
  explanationText: {
    lineHeight: 26,
    fontSize: 15,
    color: '#6B5B47',
    marginBottom: 20,
  },
  salTypesContainer: {
    marginTop: 20,
    gap: 16,
  },
  salTypeTitle: {
    marginBottom: 12,
    color: '#8B6F47',
    fontSize: 18,
    fontWeight: '700',
  },
  salTypeItem: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  salTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0522D',
    marginBottom: 6,
  },
  salTypeDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B5B47',
    paddingLeft: 8,
  },
  salCombination: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C4',
  },
  salCombinationTitle: {
    marginBottom: 12,
    color: '#8B6F47',
    fontSize: 18,
    fontWeight: '700',
  },
  salCombinationText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B5B47',
  },
  salConclusion: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C4',
  },
  conclusionText: {
    fontSize: 15,
    lineHeight: 26,
    color: '#6B5B47',
    fontStyle: 'italic',
  },
});
