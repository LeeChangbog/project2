/**
 * 인증 컨텍스트 (전역 상태 관리)
 * - 로그인 상태 관리
 * - 사용자 정보 저장
 * - 로그인/로그아웃 기능
 */
import { authAPI } from '@/utils/apiClient';
import React, { createContext, ReactNode, useContext, useState } from 'react';

// 백엔드 API 사용 여부 확인
// 배포 환경(웹)에서는 항상 백엔드 API 사용, 로컬 개발 환경에서는 환경 변수 확인
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const USE_BACKEND_API = isProduction || process.env.EXPO_PUBLIC_USE_BACKEND_API === 'true';

/**
 * 사용자 정보 타입
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  profile?: {
    name: string;
    birthDate: string;
    birthTime: string; // 사용하지 않음, 하위 호환성을 위해 유지
    gender: string;
  };
}

/**
 * 인증 컨텍스트 타입
 */
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (profile: AuthUser['profile']) => void;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 인증 제공자 컴포넌트
 * - 앱 전체를 감싸서 인증 상태 제공
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  /**
   * 로그인 함수
   * - 백엔드 API 사용 시: 실제 서버와 통신
   * - 백엔드 미사용 시: 로컬 스토리지 기반 임시 로그인
   * @returns {Promise<{ success: boolean; message?: string }>} 로그인 결과와 메시지
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      if (USE_BACKEND_API) {
        // 백엔드 API 호출
        const response = await authAPI.login(email, password);
        
        if (response.success && response.user) {
          setUser({
            id: response.user.id || email,
            email: response.user.email || email,
            name: response.user.name,
            profile: response.user.profile,
          });
          return { success: true };
        } else {
          console.error('로그인 실패:', response.message);
          return { success: false, message: response.message || '로그인에 실패했습니다.' };
        }
      } else {
        // 백엔드 API가 비활성화된 경우 - 프로덕션에서는 허용하지 않음
        console.error('⚠️ 백엔드 API가 비활성화되어 있습니다. 프로덕션 환경에서는 백엔드 API를 사용해야 합니다.');
        return { 
          success: false, 
          message: '서버 연결 오류가 발생했습니다. 관리자에게 문의하세요.' 
        };
      }
    } catch (error: any) {
      console.error('로그인 실패:', error);
      return { 
        success: false, 
        message: error?.message || '로그인 중 오류가 발생했습니다.' 
      };
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = async () => {
    if (USE_BACKEND_API) {
      await authAPI.logout();
    }
    setUser(null);
    
    // 로컬 스토리지 정리
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('userProfile');
      }
    } catch (e) {
      console.log('localStorage not available');
    }
  };

  /**
   * 프로필 업데이트 함수
   * @returns {Promise<boolean>} 성공 여부
   */
  const updateProfile = async (profile: AuthUser['profile']): Promise<boolean> => {
    if (!user || !profile) return false;

    try {
      if (USE_BACKEND_API) {
        // 백엔드 API 호출
        const response = await authAPI.updateProfile(profile);
        
        if (response.success && response.user) {
          setUser({
            ...user,
            profile: response.user.profile || profile,
          });
          return true;
        } else {
          console.error('프로필 업데이트 실패');
          return false;
        }
      } else {
        // 로컬 스토리지에 저장 (백엔드 미사용 시)
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('userProfile', JSON.stringify(profile));
          }
        } catch (e) {
          console.log('localStorage not available');
        }

        setUser({
          ...user,
          profile,
        });
        return true;
      }
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 인증 훅
 * - 컨텍스트에서 인증 데이터를 쉽게 가져오기 위한 훅
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

