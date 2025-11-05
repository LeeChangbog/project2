/**
 * 이용자 정보 입력 화면
 * - 두 명의 이용자 정보를 입력받는 화면
 * - 이름(한글만), 생년월일, 생시, 성별 입력
 * - 입력 완료 후 로딩 화면으로 이동
 */
import { AppHeader } from '@/components/AppHeader';
import { DatePicker } from '@/components/DatePicker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TimePicker } from '@/components/TimePicker';
import { Colors } from '@/constants/theme';
import { useUserData } from '@/contexts/UserDataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function InputScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  // 전역 상태에서 사용자 데이터 가져오기
  const { user1, user2, setUser1, setUser2 } = useUserData();

  // 로컬 상태: 입력 중인 값 관리 (제출 전까지는 로컬에서만 관리)
  const [localUser1, setLocalUser1] = useState(user1);
  const [localUser2, setLocalUser2] = useState(user2);

  /**
   * 제출 버튼 클릭 시 실행되는 함수
   * - 입력값 검증
   * - 이름 필터링 (한글만 허용)
   * - 전역 상태에 저장
   * - 로딩 화면으로 이동
   */
  const handleSubmit = () => {
    // 이름 필터링 (제출 전 최종 필터링)
    const filteredName1 = localUser1.name.replace(/[^가-힣\s]/g, '');
    const filteredName2 = localUser2.name.replace(/[^가-힣\s]/g, '');
    
    // 입력값 검증
    if (!filteredName1 || !localUser1.birthDate || !localUser1.gender ||
        !filteredName2 || !localUser2.birthDate || !localUser2.gender) {
      alert('모든 필수 정보(이름, 생년월일, 성별)를 입력해주세요.');
      return;
    }
    
    // 필터링된 이름으로 업데이트
    const finalUser1 = { ...localUser1, name: filteredName1 };
    const finalUser2 = { ...localUser2, name: filteredName2 };
    
    // Context에 데이터 저장
    setUser1(finalUser1);
    setUser2(finalUser2);
    router.push('/loading');
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="이용자 정보 입력" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 첫 번째 이용자 */}
          <ThemedView style={styles.userSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              첫 번째 이용자
            </ThemedText>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>이름 * (한글만)</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: colorScheme === 'dark' ? '#F5E6D3' : '#5C4033' },
                ]}
                placeholder="한글 이름을 입력하세요"
                placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
                value={localUser1.name}
                onChangeText={(text) => {
                  // 한글 입력 중 필터링을 하지 않음 (조합 중 문자 유지)
                  // 입력 중에는 그대로 저장
                  setLocalUser1({ ...localUser1, name: text });
                }}
                onBlur={() => {
                  // 포커스를 잃을 때만 필터링 (영문자 등 제거)
                  const filtered = localUser1.name.replace(/[^가-힣\s]/g, '');
                  if (filtered !== localUser1.name) {
                    setLocalUser1({ ...localUser1, name: filtered });
                  }
                }}
                maxLength={10}
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>생년월일 *</ThemedText>
              <DatePicker
                value={localUser1.birthDate}
                onChange={(date) => setLocalUser1({ ...localUser1, birthDate: date })}
                placeholder="YYYY-MM-DD"
                colorScheme={colorScheme ?? 'light'}
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>생시 (선택)</ThemedText>
              <TimePicker
                value={localUser1.birthTime}
                onChange={(time) => setLocalUser1({ ...localUser1, birthTime: time })}
                placeholder="HH:MM"
                colorScheme={colorScheme ?? 'light'}
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>성별 *</ThemedText>
              <ThemedView style={styles.genderButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    localUser1.gender === '남' && styles.genderButtonActive,
                    localUser1.gender === '남' && { backgroundColor: tintColor },
                  ]}
                  onPress={() => setLocalUser1({ ...localUser1, gender: '남' })}>
                  <ThemedText
                    style={[
                      styles.genderButtonText,
                      localUser1.gender === '남' && styles.genderButtonTextActive,
                    ]}>
                    남
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    localUser1.gender === '여' && styles.genderButtonActive,
                    localUser1.gender === '여' && { backgroundColor: tintColor },
                  ]}
                  onPress={() => setLocalUser1({ ...localUser1, gender: '여' })}>
                  <ThemedText
                    style={[
                      styles.genderButtonText,
                      localUser1.gender === '여' && styles.genderButtonTextActive,
                    ]}>
                    여
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* 두 번째 이용자 */}
          <ThemedView style={styles.userSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              두 번째 이용자
            </ThemedText>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>이름 * (한글만)</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: colorScheme === 'dark' ? '#F5E6D3' : '#5C4033' },
                ]}
                placeholder="한글 이름을 입력하세요"
                placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
                value={localUser2.name}
                onChangeText={(text) => {
                  // 한글 입력 중 필터링을 하지 않음 (조합 중 문자 유지)
                  // 입력 중에는 그대로 저장
                  setLocalUser2({ ...localUser2, name: text });
                }}
                onBlur={() => {
                  // 포커스를 잃을 때만 필터링 (영문자 등 제거)
                  const filtered = localUser2.name.replace(/[^가-힣\s]/g, '');
                  if (filtered !== localUser2.name) {
                    setLocalUser2({ ...localUser2, name: filtered });
                  }
                }}
                maxLength={10}
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>생년월일 *</ThemedText>
              <DatePicker
                value={localUser2.birthDate}
                onChange={(date) => setLocalUser2({ ...localUser2, birthDate: date })}
                placeholder="YYYY-MM-DD"
                colorScheme={colorScheme ?? 'light'}
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>생시 (선택)</ThemedText>
              <TimePicker
                value={localUser2.birthTime}
                onChange={(time) => setLocalUser2({ ...localUser2, birthTime: time })}
                placeholder="HH:MM"
                colorScheme={colorScheme ?? 'light'}
              />
            </ThemedView>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>성별 *</ThemedText>
              <ThemedView style={styles.genderButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    localUser2.gender === '남' && styles.genderButtonActive,
                    localUser2.gender === '남' && { backgroundColor: tintColor },
                  ]}
                  onPress={() => setLocalUser2({ ...localUser2, gender: '남' })}>
                  <ThemedText
                    style={[
                      styles.genderButtonText,
                      localUser2.gender === '남' && styles.genderButtonTextActive,
                    ]}>
                    남
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    localUser2.gender === '여' && styles.genderButtonActive,
                    localUser2.gender === '여' && { backgroundColor: tintColor },
                  ]}
                  onPress={() => setLocalUser2({ ...localUser2, gender: '여' })}>
                  <ThemedText
                    style={[
                      styles.genderButtonText,
                      localUser2.gender === '여' && styles.genderButtonTextActive,
                    ]}>
                    여
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: tintColor }]}
            onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>궁합 결과 확인</ThemedText>
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
  userSection: {
    gap: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    borderRadius: 16,
    backgroundColor: '#FFF8F0',
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
  sectionTitle: {
    marginBottom: 8,
    fontSize: 18,
  },
  inputGroup: {
    gap: 8,
    minHeight: 70,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B6F47',
  },
  input: {
    borderWidth: 2,
    borderColor: '#D4C4B0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 48,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(212, 196, 176, 0.1)',
      },
    }),
  },
  submitButton: {
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
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  genderButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  genderButtonActive: {
    borderColor: '#C9A961',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B6F47',
  },
  genderButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});

