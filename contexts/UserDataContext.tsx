/**
 * 사용자 데이터 컨텍스트 (전역 상태 관리)
 * - 두 이용자의 입력 정보 저장 (이름, 생년월일, 생시, 성별)
 * - 계산된 궁합 결과 저장
 * - 앱 전체에서 데이터 공유
 */
import { Saju, SalAnalysis } from '@/utils/sajuCalculator';
import React, { createContext, ReactNode, useContext, useState } from 'react';

/**
 * 이용자 정보 타입
 */
export interface UserData {
  name: string;        // 이름 (한글만)
  birthDate: string;   // 생년월일 (YYYY-MM-DD 형식)
  birthTime: string;   // 생시 (HH:MM 형식)
  gender: string;      // 성별 ('남' 또는 '여')
}

/**
 * 궁합 계산 결과 타입
 */
export interface CompatibilityResult {
  score: number;              // 궁합 점수 (0-100)
  saju1: Saju;                // 첫 번째 이용자의 사주
  saju2: Saju;                // 두 번째 이용자의 사주
  salAnalysis: SalAnalysis[]; // 살 분석 결과 배열
  explanation: string;         // 점수에 대한 설명
}

/**
 * 컨텍스트 타입 정의
 */
interface UserDataContextType {
  user1: UserData;
  user2: UserData;
  setUser1: (user: UserData) => void;
  setUser2: (user: UserData) => void;
  compatibilityResult: CompatibilityResult | null;
  setCompatibilityResult: (result: CompatibilityResult | null) => void;
}

// 컨텍스트 생성
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

/**
 * 사용자 데이터 제공자 컴포넌트
 * - 앱 전체를 감싸서 전역 상태 제공
 * - 두 이용자 정보와 계산 결과를 관리
 */
export function UserDataProvider({ children }: { children: ReactNode }) {
  // 첫 번째 이용자 정보 상태
  const [user1, setUser1] = useState<UserData>({
    name: '',
    birthDate: '',
    birthTime: '',
    gender: '',
  });
  
  // 두 번째 이용자 정보 상태
  const [user2, setUser2] = useState<UserData>({
    name: '',
    birthDate: '',
    birthTime: '',
    gender: '',
  });
  
  // 궁합 계산 결과 상태
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);

  return (
    <UserDataContext.Provider
      value={{ user1, user2, setUser1, setUser2, compatibilityResult, setCompatibilityResult }}>
      {children}
    </UserDataContext.Provider>
  );
}

/**
 * 사용자 데이터 훅
 * - 컨텍스트에서 데이터를 쉽게 가져오기 위한 훅
 * - 컨텍스트 외부에서 사용 시 에러 발생
 */
export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}

