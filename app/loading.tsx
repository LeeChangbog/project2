/**
 * 로딩 화면
 * - 입력 화면에서 제출 후 나타나는 화면
 * - 사주 궁합 계산을 수행
 * - 계산 완료 후 결과 화면으로 자동 이동
 */
import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useUserData } from '@/contexts/UserDataContext';
import { calculateCompatibility } from '@/utils/sajuCalculator';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingScreen() {
  const router = useRouter();
  // 전역 상태에서 사용자 데이터와 결과 저장 함수 가져오기
  const { user1, user2, setCompatibilityResult } = useUserData();

  /**
   * 컴포넌트 마운트 시 실행
   * - 사주 궁합 계산 수행
   * - 계산 결과를 전역 상태에 저장
   * - 결과 화면으로 이동
   */
  useEffect(() => {
    // 실제 사주 계산 수행
    const calculate = async () => {
      try {
        // 입력값 검증
        if (!user1.birthDate || !user2.birthDate) {
          throw new Error('생년월일이 입력되지 않았습니다.');
        }

        // 생년월일, 생시, 이름, 성별 정보로 궁합 계산
        const result = calculateCompatibility(
          user1.birthDate,
          user1.birthTime || '12:00',
          user2.birthDate,
          user2.birthTime || '12:00',
          user1.name || '',
          user2.name || '',
          user1.gender || '',
          user2.gender || ''
        );

        // 계산 결과 확인
        console.log('사주 계산 결과:', {
          score: result.score,
          saju1: result.saju1,
          saju2: result.saju2,
          salAnalysis: result.salAnalysis,
        });

        // 결과를 Context에 저장
        setCompatibilityResult(result);

        // 계산 완료 후 결과 화면으로 이동
        setTimeout(() => {
          router.replace('/result');
        }, 500);
      } catch (error) {
        console.error('사주 계산 오류:', error);
        alert(`계산 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        // 오류 발생 시 홈 화면으로 이동
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
      }
    };

    // 약간의 지연 후 계산 시작 (로딩 효과)
    const timer = setTimeout(() => {
      calculate();
    }, 1500);

    return () => clearTimeout(timer);
  }, [router, user1, user2, setCompatibilityResult]);

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="분석 중" showHomeButton={false} />
      <ThemedView style={styles.content}>
        <ActivityIndicator size="large" color="#C9A961" />
        <ThemedText type="subtitle" style={styles.loadingText}>
          궁합을 분석하고 있습니다...
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
  },
});

