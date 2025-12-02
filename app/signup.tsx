/**
 * 회원가입 화면
 * - 이메일, 비밀번호, 비밀번호 확인으로 회원가입
 * - 로그인 화면으로 이동 링크
 */
import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authAPI } from '@/utils/apiClient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { showAlert } from '@/utils/alert';

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // 입력값 검증
    if (!email || !password || !confirmPassword) {
      showAlert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('입력 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      showAlert('입력 오류', '비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      showAlert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);
      
      // 회원가입 API 호출
      const USE_BACKEND_API = process.env.EXPO_PUBLIC_USE_BACKEND_API === 'true';
      console.log('🔍 회원가입 시작:', { email, USE_BACKEND_API });
      
      if (USE_BACKEND_API) {
        console.log('📤 회원가입 API 호출 중...');
        const response = await authAPI.signup(email, password);
        console.log('📥 회원가입 API 응답:', response);
        
        if (response && response.success) {
          console.log('✅ 회원가입 성공, 자동 로그인 시도...');
          // 회원가입 성공 시 자동 로그인
          const loginResult = await login(email, password);
          console.log('📥 로그인 결과:', loginResult);
          
          if (loginResult && loginResult.success) {
            showAlert('회원가입 성공', '회원가입이 완료되었습니다.');
            // 팝업 표시 후 홈 화면으로 자동 이동
            setTimeout(() => {
              router.replace('/(tabs)');
            }, 500);
          } else {
            showAlert('회원가입 성공', '회원가입이 완료되었습니다. 로그인해주세요.');
            // 팝업 표시 후 로그인 화면으로 자동 이동
            setTimeout(() => {
              router.replace('/login');
            }, 500);
          }
        } else {
          // 백엔드에서 반환한 구체적인 에러 메시지 표시
          const errorMessage = response?.message || '회원가입 중 오류가 발생했습니다.';
          console.error('❌ 회원가입 실패:', errorMessage);
          showAlert('회원가입 실패', errorMessage);
        }
      } else {
        console.log('⚠️ 백엔드 API 미사용 모드');
        // 백엔드 미사용 시 임시 처리
        showAlert('회원가입 성공', '회원가입이 완료되었습니다.');
        // 팝업 표시 후 로그인 화면으로 자동 이동
        setTimeout(() => {
          router.replace('/login');
        }, 500);
      }
    } catch (error) {
      console.error('❌ 회원가입 오류:', error);
      showAlert('오류', `회원가입 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="회원가입" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 회원가입 폼 */}
          <ThemedView style={styles.formContainer}>
            <ThemedText type="title" style={styles.title}>
              회원가입
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              새로운 계정을 만들어보세요
            </ThemedText>

            {/* 이메일 입력 */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>이메일</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: '#D4C4B0',
                    backgroundColor: '#FFFFFF',
                    color: colorScheme === 'dark' ? '#F5E6D3' : '#5C4033',
                  },
                ]}
                placeholder="이메일을 입력하세요"
                placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>

            {/* 비밀번호 입력 */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>비밀번호</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: '#D4C4B0',
                    backgroundColor: '#FFFFFF',
                    color: colorScheme === 'dark' ? '#F5E6D3' : '#5C4033',
                  },
                ]}
                placeholder="비밀번호를 입력하세요 (최소 6자)"
                placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>

            {/* 비밀번호 확인 입력 */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>비밀번호 확인</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: '#D4C4B0',
                    backgroundColor: '#FFFFFF',
                    color: colorScheme === 'dark' ? '#F5E6D3' : '#5C4033',
                  },
                ]}
                placeholder="비밀번호를 다시 입력하세요"
                placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>

            {/* 회원가입 버튼 */}
            <TouchableOpacity
              style={[
                styles.signupButton,
                { backgroundColor: tintColor, opacity: loading ? 0.6 : 1 },
                Platform.select({
                  web: {
                    cursor: loading ? 'not-allowed' : 'pointer',
                  },
                }),
              ]}
              onPress={handleSignup}
              disabled={loading}>
              <ThemedText style={styles.signupButtonText}>
                {loading ? '회원가입 중...' : '회원가입'}
              </ThemedText>
            </TouchableOpacity>

            {/* 로그인 링크 */}
            <ThemedView style={styles.loginLinkContainer}>
              <ThemedText style={styles.loginLinkText}>
                이미 계정이 있으신가요?{' '}
              </ThemedText>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <ThemedText style={[styles.loginLink, { color: tintColor }]}>
                  로그인
                </ThemedText>
              </TouchableOpacity>
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
    justifyContent: 'center',
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
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B6F47',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
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
  signupButton: {
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
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6B5B47',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

