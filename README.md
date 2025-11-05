# 사주문어 (SajuMonooApp) 🔮

사주 팔자를 기반으로 한 궁합 분석 모바일 앱입니다. 두 사람의 생년월일시, 이름, 성별을 입력받아 궁합 점수를 계산하고 시각화합니다.

## 주요 기능

- 📱 **크로스 플랫폼**: 웹, iOS, Android 지원
- 🔮 **사주 궁합 계산**: 생년월일시, 이름, 성별을 기반으로 궁합 점수 계산
- 📊 **팔각형 방사형 그래프**: 8개 '살' 요소를 시각화
- 💡 **살 설명**: 각 살에 대한 상세 설명 제공
- 🤖 **AI 조언**: OpenAI API를 활용한 개인화된 궁합 조언
- 👤 **로그인/회원가입**: 사용자 인증 및 프로필 관리
- 💾 **프로필 저장**: 내 정보 저장 및 자동 불러오기
- 🎨 **전통 사주 디자인**: 사주 팔자에 어울리는 디자인

## 기술 스택

- **프레임워크**: Expo SDK 54 + React Native 0.81.5
- **언어**: TypeScript 5.9.2
- **라우팅**: Expo Router 6.0 (파일 기반)
- **상태 관리**: React Context API
- **그래프**: react-native-svg

## 🚀 처음부터 시작하기 (초보자 가이드)

### 필요한 준비물

1. **Node.js 설치** (버전 18 이상 권장)
   - [Node.js 공식 사이트](https://nodejs.org/)에서 다운로드 및 설치
   - 설치 확인: 터미널에서 `node --version` 입력

2. **Git 설치** (이미 설치되어 있을 수 있음)
   - [Git 공식 사이트](https://git-scm.com/)에서 다운로드 및 설치
   - 설치 확인: 터미널에서 `git --version` 입력

3. **Expo Go 앱 설치** (스마트폰에 설치)
   - **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)에서 설치
   - **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)에서 설치

### 단계별 실행 방법

#### 1단계: GitHub에서 코드 다운로드

```bash
# 저장소 클론
git clone https://github.com/skychoi1027/-1.git

# 프로젝트 폴더로 이동
cd -1
```

또는 GitHub에서 ZIP 파일을 다운로드하여 압축 해제한 후 폴더로 이동

#### 2단계: 의존성 설치

```bash
# npm 패키지 설치 (5-10분 정도 소요)
npm install
```

> ⚠️ **주의**: `npm install`이 완료될 때까지 기다려주세요. 에러가 발생하면 `npm install --legacy-peer-deps`를 시도해보세요.

#### 3단계: 개발 서버 시작

```bash
# Expo 개발 서버 시작
npm start
```

터미널에 QR 코드가 표시됩니다!

#### 4단계: Expo Go로 앱 실행

**Android:**
1. Expo Go 앱 실행
2. "Scan QR code" 클릭
3. 터미널에 표시된 QR 코드 스캔
4. 앱이 자동으로 로드됩니다

**iOS:**
1. Expo Go 앱 실행
2. 카메라 앱으로 QR 코드 스캔 (또는 Expo Go 앱 내에서 스캔)
3. "Open in Expo Go" 클릭
4. 앱이 자동으로 로드됩니다

**웹에서 실행:**
```bash
# 터미널에서 'w' 키를 누르거나
npm run web
```

### 📱 Expo Go로 실행할 때 주의사항

- **같은 Wi-Fi 네트워크**: 컴퓨터와 스마트폰이 같은 Wi-Fi에 연결되어 있어야 합니다
- **방화벽**: 방화벽이 Expo 서버를 차단하지 않는지 확인하세요
- **터널 모드**: 같은 Wi-Fi가 아닌 경우, 터미널에서 `Shift + t`를 눌러 터널 모드를 활성화하세요 (더 느릴 수 있음)

### 🐛 문제 해결

**의존성 설치 오류:**
```bash
# 캐시 삭제 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Expo Go에서 연결 안 됨:**
```bash
# 터널 모드로 실행
npm start -- --tunnel
```

**포트 충돌:**
```bash
# 다른 포트 사용
npx expo start --port 8082
```

## 설치 및 실행 (기존 사용자)

### 1. 의존성 설치

```bash
npm install
```

### 2. 앱 실행

```bash
# 개발 서버 시작
npm start

# 웹에서 실행
npm run web

# iOS에서 실행
npm run ios

# Android에서 실행
npm run android
```

### 3. 캐시 초기화 (필요시)

```bash
# 캐시 초기화 후 시작
npm run start:clear

# 웹 캐시 초기화
npm run web:clear
```

## 프로젝트 구조

```
SajuMonooApp/
├── app/                    # 화면 파일들 (Expo Router 파일 기반 라우팅)
│   ├── (tabs)/            # 탭 네비게이션
│   │   └── index.tsx     # 홈 화면
│   ├── _layout.tsx        # 루트 레이아웃 (Provider 설정)
│   ├── input.tsx          # 이용자 정보 입력 화면
│   ├── loading.tsx        # 로딩 화면 (사주 계산 중)
│   ├── result.tsx        # 궁합 결과 화면
│   ├── ai-advice.tsx     # AI 조언 화면
│   ├── login.tsx          # 로그인 화면
│   ├── signup.tsx         # 회원가입 화면
│   ├── profile.tsx        # 내 정보 화면 (프로필 설정)
│   └── modal.tsx          # 모달 화면 (예시)
├── components/            # 재사용 가능한 컴포넌트
│   ├── AppHeader.tsx     # 앱 헤더 (상단 고정, 로그인 상태 표시)
│   ├── OctagonGraph.tsx  # 팔각형 방사형 그래프 (8개 살 시각화)
│   ├── DatePicker.tsx    # 날짜 선택 컴포넌트 (웹/모바일 대응)
│   ├── TimePicker.tsx    # 시간 선택 컴포넌트 (웹/모바일 대응)
│   ├── themed-text.tsx   # 테마 적용 텍스트 컴포넌트
│   ├── themed-view.tsx   # 테마 적용 뷰 컴포넌트
│   └── ui/               # UI 컴포넌트
│       ├── icon-symbol.tsx      # 플랫폼별 아이콘 컴포넌트
│       └── icon-symbol.ios.tsx  # iOS 전용 아이콘 컴포넌트
├── contexts/              # 전역 상태 관리 (Context API)
│   ├── UserDataContext.tsx     # 사용자 입력 데이터 및 궁합 결과
│   └── AuthContext.tsx         # 인증 상태 및 사용자 정보
├── utils/                 # 유틸리티 함수
│   ├── sajuCalculator.ts # 사주 계산 로직 (간지 변환, 살 분석, 점수 계산)
│   └── aiService.ts      # AI 조언 서비스 (OpenAI API 연동)
├── constants/             # 상수 정의
│   └── theme.ts          # 테마 색상 및 스타일
├── hooks/                 # 커스텀 훅
│   ├── use-color-scheme.ts    # 다크/라이트 모드 감지
│   └── use-theme-color.ts     # 테마 색상 가져오기
├── assets/                # 이미지 및 리소스
│   └── images/           # 앱 아이콘 및 이미지
├── scripts/               # 스크립트 파일
│   └── reset-project.js  # 프로젝트 초기화 스크립트
├── AI_SETUP.md           # AI 조언 기능 설정 가이드
├── BACKEND_API_GUIDE.md  # 백엔드 API 연동 가이드
├── AI_ROLE_EXPLANATION.md # AI API 역할 설명
└── README.md             # 프로젝트 설명서
```

## 기능 설명

### 1. 홈 화면
- 앱 소개 및 예시 결과 표시
- '사주 궁합 보기' 버튼으로 입력 화면 이동
- 로그인/회원가입 버튼 (우상단) 또는 내 정보/로그아웃 버튼

### 2. 로그인/회원가입
- 이메일과 비밀번호로 계정 생성 및 로그인
- 로그인 성공 시 프로필 관리 가능
- 로그인 상태에 따라 헤더 버튼 자동 변경

### 3. 내 정보 화면
- 프로필 정보 저장 (이름, 생년월일, 생시, 성별)
- 저장된 정보는 궁합 입력 시 자동으로 불러올 수 있음
- '내 정보 불러오기' 버튼으로 편리하게 사용

### 4. 이용자 정보 입력 화면
- 두 명의 이용자 정보 입력
  - 이름: 한글만 입력 가능
  - 생년월일: YYYY-MM-DD 형식
  - 생시: HH:MM 형식
  - 성별: 남/여 선택
- 사용자1 옆 '내 정보 불러오기' 버튼 (로그인 시 사용 가능)

### 5. 로딩 화면
- 사주 궁합 계산 수행
- 계산 완료 후 결과 화면으로 자동 이동

### 6. 궁합 결과 화면
- 궁합 점수 (0-100점)
- 두 이용자의 사주 정보 표시
- 팔각형 방사형 그래프로 8개 '살' 시각화
- 각 살에 대한 설명 툴팁
- 'AI 조언 받으러가기' 버튼

### 7. AI 조언 화면
- OpenAI API를 활용한 개인화된 궁합 조언
- 계산 결과를 바탕으로 실용적인 조언 제공
- 구체적인 팁 및 요약 제공
- 백엔드 API 연동 지원 (설정 가능)

## 사주 계산 방식

### 감점 요소
- **살(煞)**: 충살, 형살, 파살, 해살 등
  - 각 살당 10점 감점
- **오행 상극**: 상극 관계당 2점 감점
- **이름 오행 상극**: 2점 감점

### 가점 요소
- **오행 상생**: 상생 관계당 1점 가점 (최대 10점)
- **성별 조합**: 이성 조합 시 5점 가점
- **음양 조화**: 일간과 성별의 음양 조화
- **이름 오행 상생**: 3점 가점
- **이름 획수 차이**: 획수 차이가 5 이하일 때 2점 가점

## 추가 기능

### AI 조언 기능
- OpenAI API를 사용한 개인화된 조언 (선택사항)
- API 키 없이도 기본 조언 제공
- 백엔드 API 연동 지원
- 상세한 설정 가이드는 [AI_SETUP.md](./AI_SETUP.md) 참고

### 백엔드 API 연동
- 백엔드 API 연동을 위한 틀 제공
- 환경 변수로 간단하게 전환 가능
- 상세한 가이드는 [BACKEND_API_GUIDE.md](./BACKEND_API_GUIDE.md) 참고

## 개발 환경

- Node.js (18 이상 권장)
- npm 또는 yarn
- Expo Go (모바일 테스트용)

## 문서

- [AI_SETUP.md](./AI_SETUP.md) - AI 조언 기능 설정 가이드
- [BACKEND_API_GUIDE.md](./BACKEND_API_GUIDE.md) - 백엔드 API 연동 가이드
- [AI_ROLE_EXPLANATION.md](./AI_ROLE_EXPLANATION.md) - AI API 역할 설명

## 라이선스

이 프로젝트는 개인 프로젝트입니다.
