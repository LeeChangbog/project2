/**
 * 궁합 결과 화면
 * - 계산된 궁합 점수 표시
 * - 두 이용자의 사주 정보 표시
 * - 팔각형 방사형 그래프로 8개 '살' 시각화
 * - 각 '살'에 대한 설명 툴팁 제공
 */
import { AppHeader } from '@/components/AppHeader';
import { OctagonGraph } from '@/components/OctagonGraph';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useUserData } from '@/contexts/UserDataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * 기본 살 데이터 (8개의 살)
 * - 계산 결과가 없을 때 사용되는 기본값
 * - 각 살의 이름과 설명 포함
 */
const defaultSalData = [
  { name: '충살', value: 0, description: '충살은 서로 반대되는 성향으로 인한 갈등을 의미합니다.' },
  { name: '형살', value: 0, description: '형살은 상호간의 충돌과 다툼을 나타냅니다.' },
  { name: '파살', value: 0, description: '파살은 관계의 불안정성을 나타냅니다.' },
  { name: '해살', value: 0, description: '해살은 서로 해를 끼치는 요소입니다.' },
  { name: '충형살', value: 0, description: '충형살은 충돌과 형벌이 결합된 요소입니다.' },
  { name: '충파살', value: 0, description: '충파살은 충돌과 파괴가 결합된 요소입니다.' },
  { name: '형해살', value: 0, description: '형해살은 형살과 해살의 결합입니다.' },
  { name: '파해살', value: 0, description: '파해살은 파괴와 해로움이 결합된 요소입니다.' },
];

export default function ResultScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  // 전역 상태에서 사용자 데이터와 계산 결과 가져오기
  const { user1, user2, compatibilityResult } = useUserData();

  // 실제 계산 결과 사용 또는 기본값
  const score = compatibilityResult?.score || 0;
  const explanation = compatibilityResult?.explanation || '';
  
  /**
   * 살 데이터를 실제 계산 결과로 변환 (8개의 살)
   * - 계산된 살 데이터를 8개 살 구조에 매핑
   * - 조합된 살은 개별 살의 합으로 계산
   * - 퍼센트로 변환하여 그래프에 표시
   */
  const salData = React.useMemo(() => {
    if (!compatibilityResult?.salAnalysis || compatibilityResult.salAnalysis.length === 0) {
      return defaultSalData;
    }

    // 실제 계산된 살 데이터를 기본 구조에 매핑
    const salMap: { [key: string]: number } = {};
    compatibilityResult.salAnalysis.forEach((sal) => {
      // 각 살당 count를 퍼센트로 변환 (최대 100%)
      salMap[sal.type] = Math.min(sal.count * 10, 100);
    });

    // 기본 8개 살 데이터에 실제 계산값 매핑
    return defaultSalData.map((item) => {
      // 이름 매칭 (일부는 약간 다를 수 있음)
      let mappedValue = salMap[item.name] || 0;
      
      // 조합된 살의 경우 개별 살의 합으로 계산
      if (item.name.includes('충') && item.name.includes('형')) {
        mappedValue = Math.min((salMap['충살'] || 0) + (salMap['형살'] || 0), 100);
      } else if (item.name.includes('충') && item.name.includes('파')) {
        mappedValue = Math.min((salMap['충살'] || 0) + (salMap['파살'] || 0), 100);
      } else if (item.name.includes('형') && item.name.includes('해')) {
        mappedValue = Math.min((salMap['형살'] || 0) + (salMap['해살'] || 0), 100);
      } else if (item.name.includes('파') && item.name.includes('해')) {
        mappedValue = Math.min((salMap['파살'] || 0) + (salMap['해살'] || 0), 100);
      }
      
      return {
        ...item,
        value: mappedValue,
      };
    });
  }, [compatibilityResult]);

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="궁합 결과" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 이용자 정보 표시 */}
          <ThemedView style={styles.userInfoSection}>
            <ThemedText style={styles.userInfoText} numberOfLines={1}>
              {user1.name || '이용자1'} vs {user2.name || '이용자2'}
            </ThemedText>
          </ThemedView>

          {/* 점수 표시 */}
          <ThemedView style={styles.scoreSection}>
            <ThemedText type="title" style={styles.scoreValue}>
              {score}점
            </ThemedText>
            <ThemedText style={styles.scoreLabel}>궁합 점수</ThemedText>
            {explanation && (
              <ThemedText style={styles.explanationText}>{explanation}</ThemedText>
            )}
          </ThemedView>

          {/* 사주 정보 표시 (선택적) */}
          {compatibilityResult && (
            <ThemedView style={styles.sajuInfoSection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                사주 정보
              </ThemedText>
              <ThemedView style={styles.sajuRow}>
                <ThemedText style={styles.sajuLabel} numberOfLines={1}>
                  {user1.name || '이용자1'}:
                </ThemedText>
                <ThemedText style={styles.sajuText} numberOfLines={2}>
                  {compatibilityResult.saju1.year.gan}{compatibilityResult.saju1.year.ji}년{' '}
                  {compatibilityResult.saju1.month.gan}{compatibilityResult.saju1.month.ji}월{' '}
                  {compatibilityResult.saju1.day.gan}{compatibilityResult.saju1.day.ji}일{' '}
                  {compatibilityResult.saju1.hour.gan}{compatibilityResult.saju1.hour.ji}시
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.sajuRow}>
                <ThemedText style={styles.sajuLabel} numberOfLines={1}>
                  {user2.name || '이용자2'}:
                </ThemedText>
                <ThemedText style={styles.sajuText} numberOfLines={2}>
                  {compatibilityResult.saju2.year.gan}{compatibilityResult.saju2.year.ji}년{' '}
                  {compatibilityResult.saju2.month.gan}{compatibilityResult.saju2.month.ji}월{' '}
                  {compatibilityResult.saju2.day.gan}{compatibilityResult.saju2.day.ji}일{' '}
                  {compatibilityResult.saju2.hour.gan}{compatibilityResult.saju2.hour.ji}시
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          {/* 감점 요소 그래프 (팔각형 방사형 그래프) */}
          <ThemedView style={styles.graphSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              감점 요소 (8개 살)
            </ThemedText>
            <OctagonGraph salData={salData} />
          </ThemedView>

          {/* 결과 확인 버튼 */}
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: tintColor }]}
            onPress={() => router.push('/(tabs)')}>
            <ThemedText style={styles.completeButtonText}>결과 확인 완료</ThemedText>
          </TouchableOpacity>
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
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: '#FFF8F0',
    borderRadius: 20,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    paddingHorizontal: 24,
    shadowColor: '#E8D5C4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(232, 213, 196, 0.2)',
      },
    }),
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#A0522D',
    letterSpacing: 1,
  },
  scoreLabel: {
    fontSize: 17,
    marginTop: 8,
    opacity: 0.8,
    color: '#8B6F47',
    fontWeight: '600',
  },
  explanationText: {
    lineHeight: 24,
    fontSize: 14,
    color: '#6B5B47',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  graphSection: {
    gap: 20,
  },
  userInfoSection: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(232, 213, 196, 0.1)',
      },
    }),
  },
  userInfoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B6F47',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 10,
  },
  graphSection: {
    gap: 20,
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
  sajuInfoSection: {
    marginTop: 16,
    padding: 18,
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    gap: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 6px rgba(232, 213, 196, 0.15)',
      },
    }),
  },
  sajuRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  sajuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B6F47',
    minWidth: 70,
    flexShrink: 0,
  },
  sajuText: {
    fontSize: 14,
    color: '#6B5B47',
    flex: 1,
    lineHeight: 20,
  },
});

