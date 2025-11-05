/**
 * 로그인 화면
 * - 이메일/아이디와 비밀번호로 로그인
 * - 회원가입 화면으로 이동 링크
 */
import { AppHeader } from '@/components/AppHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 입력값 검증
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('입력 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      Alert.alert('입력 오류', '비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    // TODO: 실제 로그인 API 호출
    console.log('로그인 시도:', { email, password });
    
    // 임시: 로그인 성공 처리
    Alert.alert('로그인 성공', '로그인되었습니다.', [
      {
        text: '확인',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="로그인" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 로그인 폼 */}
          <ThemedView style={styles.formContainer}>
            <ThemedText type="title" style={styles.title}>
              로그인
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              사주문어에 오신 것을 환영합니다
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
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>

            {/* 로그인 버튼 */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: tintColor },
                Platform.select({
                  web: {
                    cursor: 'pointer',
                  },
                }),
              ]}
              onPress={handleLogin}>
              <ThemedText style={styles.loginButtonText}>로그인</ThemedText>
            </TouchableOpacity>

            {/* 회원가입 링크 */}
            <ThemedView style={styles.signupLinkContainer}>
              <ThemedText style={styles.signupLinkText}>
                계정이 없으신가요?{' '}
              </ThemedText>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <ThemedText style={[styles.signupLink, { color: tintColor }]}>
                  회원가입
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
  loginButton: {
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
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupLinkText: {
    fontSize: 14,
    color: '#6B5B47',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

