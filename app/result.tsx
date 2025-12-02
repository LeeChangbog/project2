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
  const rawScore = compatibilityResult?.score || 0;
  // 소수점 한 자리로 제한
  const score = typeof rawScore === 'number' ? Number(rawScore.toFixed(1)) : 0;
  const explanation = compatibilityResult?.explanation || '';
  
  /**
   * 살 데이터를 실제 계산 결과로 변환 (8개의 살)
   * - 계산된 살 데이터를 8개 살 구조에 매핑
   * - 조합된 살은 개별 살의 합으로 계산
   * - 퍼센트로 변환하여 그래프에 표시
   */
  const salData = React.useMemo(() => {
    if (!compatibilityResult?.salAnalysis || compatibilityResult.salAnalysis.length === 0) {
      console.log('⚠️ salAnalysis가 없거나 비어있음, 기본값 사용');
      return defaultSalData;
    }

    // sajuCalculator.ts의 salNames 순서와 매핑
    // 인덱스 기반으로 매핑 (이름이 다르므로 인덱스로 매칭)
    const salNames = [
      '열정 에너지 예술 중독',
      '예민 직감 영적 불안',
      '감정기복 갈등 오해 고독',
      '강함 용감 충동 변화',
      '책임감 의리 완벽 자존심 인내',
      '충돌 자유 고집',
      '카리스마 승부욕 용감 외로움',
      '의지 솔직 직설 개성 고집 독립심',
    ];

    // 실제 계산된 살 데이터를 인덱스 기반으로 매핑
    // salAnalysis는 이제 모든 인덱스를 포함하므로 직접 매핑 가능
    const salValues: number[] = new Array(8).fill(0);
    
    // 디버깅: salAnalysis 내용 확인
    console.log('📊 salAnalysis 데이터:', compatibilityResult.salAnalysis);
    console.log('📊 salAnalysis 개수:', compatibilityResult.salAnalysis.length);
    
    // salAnalysis는 이미 인덱스 순서대로 정렬되어 있음 (sajuCalculator.ts에서 인덱스 0-7 순서로 생성)
    // 인덱스 기반으로 직접 매핑 (이름 매칭 대신 인덱스 사용)
    compatibilityResult.salAnalysis.forEach((sal, idx) => {
      // salAnalysis는 인덱스 0-7 순서로 생성되므로 idx를 직접 사용
      const index = idx;
      if (index >= 0 && index < 8) {
        // count는 감점 점수 (백엔드에서 오는 실제 값)
        // Python 코드에서 p1=8, p11=9.5, p2=7, p21=8.2, p41=10, p42=8, p43=6 등
        // 살 값은 보통 0-20 정도의 범위
        // 그래프 표시를 위해 0-100 범위로 스케일링
        // 최대값을 20으로 가정 (실제 최대값에 따라 조정 가능)
        const rawValue = sal.count || 0;
        // 20을 100%로 스케일링 (값이 20이면 100%로 표시)
        salValues[index] = Math.min((rawValue / 20) * 100, 100);
        
        // 디버깅: 모든 값 로그 (0이어도)
        console.log(`살 ${index} (${sal.type}): rawValue=${rawValue}, scaledValue=${salValues[index]}`);
      } else {
        console.warn(`⚠️ 인덱스 범위 초과: ${index} (살 이름: ${sal.type})`);
      }
    });
    
    console.log('📊 최종 salValues:', salValues);
    console.log('📊 salValues 합계:', salValues.reduce((a, b) => a + b, 0));

    // 기본 8개 살 데이터에 실제 계산값 매핑 (인덱스 기반)
    // 항상 8개의 살 데이터를 반환 (값이 0이어도 포함)
    return defaultSalData.map((item, index) => {
      return {
        ...item,
        value: salValues[index] || 0,
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

          {/* AI 조언 버튼 */}
          <TouchableOpacity
            style={[styles.aiButton, { backgroundColor: tintColor }]}
            onPress={() => router.push('/ai-advice')}>
            <ThemedText style={styles.aiButtonText}>🤖 AI 조언 받으러가기</ThemedText>
          </TouchableOpacity>

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
  aiButton: {
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
  aiButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  completeButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 12,
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

