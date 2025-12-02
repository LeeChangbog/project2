/**
 * 내 정보 화면 (프로필 설정)
 * - 궁합 입력 시 필요한 정보 저장 (이름, 생년월일, 성별)
 * - 저장된 정보를 다음 입력 시 자동으로 불러올 수 있음
 */
import { AppHeader } from '@/components/AppHeader';
import { DatePicker } from '@/components/DatePicker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { showAlert } from '@/utils/alert';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const { user, updateProfile } = useAuth();

  // 프로필 정보 상태
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');

  // 저장된 프로필 정보 불러오기
  useEffect(() => {
    if (user?.profile) {
      setName(user.profile.name || '');
      setBirthDate(user.profile.birthDate || '');
      setGender(user.profile.gender || '');
    }
  }, [user]);

  // 프로필 저장
  const handleSave = async () => {
    // 입력값 검증
    if (!name || !birthDate || !gender) {
      showAlert('입력 오류', '이름, 생년월일, 성별은 필수 입력 항목입니다.');
      return;
    }

    // 이름 한글 검증
    const koreanOnly = name.replace(/[^가-힣\s]/g, '');
    if (koreanOnly !== name) {
      showAlert('입력 오류', '이름은 한글만 입력 가능합니다.');
      setName(koreanOnly);
      return;
    }

    try {
      // 프로필 저장
      const success = await updateProfile({
        name: koreanOnly,
        birthDate,
        birthTime: '', // 시간은 사용하지 않음
        gender,
      });

      if (success) {
        // 저장 완료 팝업 표시
        showAlert('저장 완료', '프로필 정보가 저장되었습니다.');
        
        // 팝업 표시 후 이전 화면으로 이동
        setTimeout(() => {
          router.back();
        }, 500);
      } else {
        showAlert('저장 실패', '프로필 정보 저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      showAlert('저장 실패', '프로필 정보 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="내 정보" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 사용자 이메일 표시 */}
          {user && (
            <ThemedView style={styles.emailSection}>
              <ThemedText style={styles.emailLabel}>이메일</ThemedText>
              <ThemedText style={styles.emailText}>{user.email}</ThemedText>
            </ThemedView>
          )}

          {/* 프로필 정보 입력 폼 */}
          <ThemedView style={styles.formContainer}>
            <ThemedText type="title" style={styles.title}>
              프로필 정보
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              궁합 입력 시 자동으로 불러올 정보를 저장하세요
            </ThemedText>

            {/* 이름 입력 */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                이름 <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: '#D4C4B0',
                    backgroundColor: '#FFFFFF',
                    color: colorScheme === 'dark' ? '#F5E6D3' : '#5C4033',
                  },
                ]}
                placeholder="이름을 입력하세요 (한글만)"
                placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
                value={name}
                onChangeText={(text) => {
                  // 한글만 허용 (입력 중에는 필터링하지 않음)
                  setName(text);
                }}
                onBlur={() => {
                  // 포커스 해제 시 한글만 남기기
                  const filtered = name.replace(/[^가-힣\s]/g, '');
                  setName(filtered);
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>

            {/* 생년월일 입력 */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                생년월일 <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <DatePicker
                value={birthDate}
                onChange={setBirthDate}
                placeholder="YYYY-MM-DD"
                colorScheme={colorScheme}
              />
            </ThemedView>

            {/* 성별 선택 */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                성별 <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <ThemedView style={styles.genderButtonGroup}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === '남' && [styles.genderButtonActive, { backgroundColor: tintColor }],
                    Platform.select({
                      web: {
                        cursor: 'pointer',
                      },
                    }),
                  ]}
                  onPress={() => setGender('남')}>
                  <ThemedText
                    style={[
                      styles.genderButtonText,
                      gender === '남' && styles.genderButtonTextActive,
                    ]}>
                    남
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === '여' && [styles.genderButtonActive, { backgroundColor: tintColor }],
                    Platform.select({
                      web: {
                        cursor: 'pointer',
                      },
                    }),
                  ]}
                  onPress={() => setGender('여')}>
                  <ThemedText
                    style={[
                      styles.genderButtonText,
                      gender === '여' && styles.genderButtonTextActive,
                    ]}>
                    여
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            {/* 저장 버튼 */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: tintColor },
                Platform.select({
                  web: {
                    cursor: 'pointer',
                  },
                }),
              ]}
              onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>저장</ThemedText>
            </TouchableOpacity>
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
    gap: 24,
  },
  emailSection: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(232, 213, 196, 0.1)',
      },
    }),
  },
  emailLabel: {
    fontSize: 13,
    color: '#8B6F47',
    marginBottom: 4,
    fontWeight: '600',
  },
  emailText: {
    fontSize: 16,
    color: '#6B5B47',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#FFF8F0',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    gap: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(232, 213, 196, 0.2)',
        maxWidth: 500,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B6F47',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B5B47',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B6F47',
  },
  required: {
    color: '#D32F2F',
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 48,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  genderButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    minHeight: 48,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  genderButtonActive: {
    borderColor: 'transparent',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B6F47',
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#8B6F47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(139, 111, 71, 0.3)',
      },
    }),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

