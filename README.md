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
│   │   ├── _layout.tsx    # 탭 레이아웃
│   │   ├── index.tsx      # 홈 화면
│   │   └── explore.tsx    # 탐색 화면
│   ├── _layout.tsx        # 루트 레이아웃 (Provider 설정)
│   ├── input.tsx          # 이용자 정보 입력 화면
│   ├── loading.tsx        # 로딩 화면 (사주 계산 중)
│   ├── result.tsx         # 궁합 결과 화면
│   ├── ai-advice.tsx      # AI 조언 화면
│   ├── login.tsx          # 로그인 화면
│   ├── signup.tsx         # 회원가입 화면
│   ├── profile.tsx        # 내 정보 화면 (프로필 설정)
│   └── modal.tsx          # 모달 화면
├── components/            # 재사용 가능한 컴포넌트
│   ├── AppHeader.tsx      # 앱 헤더 (상단 고정, 로그인 상태 표시)
│   ├── OctagonGraph.tsx   # 팔각형 방사형 그래프 (8개 살 시각화)
│   ├── DatePicker.tsx     # 날짜 선택 컴포넌트 (웹/모바일 대응)
│   ├── TimePicker.tsx     # 시간 선택 컴포넌트 (웹/모바일 대응)
│   ├── themed-text.tsx    # 테마 적용 텍스트 컴포넌트
│   ├── themed-view.tsx    # 테마 적용 뷰 컴포넌트
│   └── ui/                # UI 컴포넌트
│       ├── icon-symbol.tsx      # 플랫폼별 아이콘 컴포넌트
│       ├── icon-symbol.ios.tsx  # iOS 전용 아이콘 컴포넌트
│       └── collapsible.tsx      # 접을 수 있는 섹션 컴포넌트
├── contexts/              # 전역 상태 관리 (Context API)
│   ├── UserDataContext.tsx     # 사용자 입력 데이터 및 궁합 결과
│   └── AuthContext.tsx          # 인증 상태 및 사용자 정보
├── utils/                 # 유틸리티 함수
│   ├── sajuCalculator.ts  # 사주 계산 로직 (간지 변환, 살 분석, 점수 계산)
│   ├── aiService.ts       # AI 조언 서비스 (OpenAI API 연동)
│   └── apiClient.ts       # 백엔드 API 호출 클라이언트 (인증 토큰 관리)
├── backend/               # 백엔드 서버 (Node.js + Express)
│   ├── server.js          # Express 서버 메인 파일
│   ├── package.json       # 백엔드 의존성
│   ├── README.md          # 백엔드 서버 설명
│   └── .gitignore         # 백엔드 Git 무시 파일
├── constants/             # 상수 정의
│   └── theme.ts           # 테마 색상 및 스타일
├── hooks/                 # 커스텀 훅
│   ├── use-color-scheme.ts      # 다크/라이트 모드 감지
│   ├── use-color-scheme.web.ts  # 웹 전용 색상 스키마 훅
│   └── use-theme-color.ts       # 테마 색상 가져오기
├── assets/                # 이미지 및 리소스
│   └── images/            # 앱 아이콘 및 이미지
├── scripts/                # 스크립트 파일
│   └── reset-project.js   # 프로젝트 초기화 스크립트
├── AI_SETUP.md            # AI 조언 기능 설정 가이드
├── BACKEND_API_GUIDE.md   # 백엔드 API 연동 가이드
├── BACKEND_EXPLANATION.md # 백엔드 서버 상세 설명
├── BACKEND_SETUP.md       # 백엔드 설정 가이드
├── CONNECTION_GUIDE.md    # 프론트엔드-백엔드 연결 가이드
├── QUICK_START.md         # 빠른 시작 가이드
├── FIX_POWERSHELL.md      # PowerShell 실행 정책 문제 해결
├── AI_ROLE_EXPLANATION.md # AI API 역할 설명
├── CALCULATION_EXPLANATION.md # 사주 계산 로직 설명
├── CLEAR_CACHE.md         # Expo 캐시 문제 해결
├── TODO_IMPLEMENTATION.md # 구현 예정 기능
├── app.json               # Expo 앱 설정
├── package.json           # 프로젝트 의존성 및 스크립트
└── README.md              # 프로젝트 설명서
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
- [BACKEND_EXPLANATION.md](./BACKEND_EXPLANATION.md) - 백엔드 서버 상세 설명

## 상세 설계

### 백엔드 서버의 역할 및 데이터베이스 연동 계획

현재 백엔드 서버는 Node.js와 Express를 기반으로 `backend/server.js` 파일에 구현되어 있습니다. 이 서버는 프론트엔드(앱/웹)와 외부 서비스(예: OpenAI) 사이의 중간 다리 역할을 합니다.

#### 주요 역할

1. **API 키 보호**: 프론트엔드에서 OpenAI API 키를 직접 사용하면 보안에 취약하므로, 백엔드 서버가 API 키를 안전하게 관리하고 OpenAI API 호출을 대리합니다.
   ```
   프론트엔드 → 백엔드 서버 → OpenAI API
   (키 없음)    (키 보관)      (키 사용)
   ```

2. **AI 조언 생성 (`POST /api/ai-advice`)**: 프론트엔드에서 궁합 결과를 받아서 OpenAI API에 전달하고, AI가 생성한 조언을 받아 프론트엔드로 반환합니다.

3. **사용자 인증 및 정보 관리**: 회원가입, 로그인, 사용자 프로필 관리 등의 기능을 담당합니다.

#### 데이터베이스 연동 계획

현재 백엔드 서버에는 사용자 인증 및 프로필 정보를 저장하는 실제 데이터베이스가 연결되어 있지 않습니다. 향후 다음과 같은 목적으로 데이터베이스를 연동할 예정입니다:

- **회원가입 정보 저장**: 사용자 계정(이메일, 비밀번호 등) 정보를 안전하게 저장
- **사용자 프로필 저장**: 사용자의 이름, 생년월일, 생시, 성별 등 개인 프로필 정보 저장
- **궁합 분석 결과 저장 (선택 사항)**: 사용자가 조회한 궁합 결과를 저장하여 재조회 및 통계 분석에 활용

**예상 기술 스택**: MongoDB (NoSQL) 또는 PostgreSQL (SQL)

**데이터베이스 스키마 예시**:
```javascript
// User Schema (MongoDB 예시)
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String,
  profile: {
    name: String,
    birthDate: String (YYYY-MM-DD),
    birthTime: String (HH:MM),
    gender: String ("남" | "여")
  },
  createdAt: Date,
  updatedAt: Date
}

// CompatibilityResult Schema (선택 사항)
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  user1: { name, birthDate, birthTime, gender },
  user2: { name, birthDate, birthTime, gender },
  score: Number,
  salAnalysis: Array,
  createdAt: Date
}
```

---

### 프론트엔드 상세 설계 (Class Diagram)

프론트엔드는 Expo/React Native를 사용하여 웹 및 모바일 환경에서 동작하는 UI를 제공합니다.

#### 프론트엔드 컴포넌트 구조

```
                            ┌─────────────────────────┐
                            │  RootLayout             │
                            │  app/_layout.tsx        │
                            │                         │
                            │  - AuthProvider         │
                            │  - UserDataProvider     │
                            │  - Stack Navigation     │
                            └──────────┬──────────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                │                      │                      │
        ┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
        │ AuthContext    │    │ UserDataContext │    │ Stack Screens   │
        │ contexts/      │    │ contexts/       │    │                 │
        │                │    │                 │    │ - (tabs)/index  │
        │ + user         │    │ + user1         │    │ - (tabs)/explore │
        │ + isAuthenticated│  │ + user2         │    │ - input         │
        │ + login()      │    │ + setUser1()    │    │ - loading       │
        │ + logout()     │    │ + setUser2()    │    │ - result        │
        │ + updateProfile│    │ + compatibility │    │ - ai-advice     │
        │                │    │   Result        │    │ - login         │
        │                │    │ + setCompatibility│  │ - signup        │
        └────────────────┘    │   Result()      │    │ - profile       │
                              └─────────────────┘    │ - modal         │
                                                      └────────┬────────┘
                                                               │
                    ┌──────────────────────────────────────────┼─────────────┐
                    │                                          │             │
          ┌─────────▼────────┐                    ┌───────────▼────────┐   │
          │ Home             │                    │ Input              │   │
          │ app/(tabs)/index │                    │ app/input.tsx      │   │
          │                  │                    │                    │   │
          │ - 궁합문어 로고   │                    │ - localUser1       │   │
          │ - 살 설명 섹션    │                    │ - localUser2       │   │
          │ - 입력 버튼       │                    │ - handleSubmit()   │   │
          │                  │                    │ - handleLoadProfile│   │
          └─────────┬────────┘                    └───────────┬────────┘   │
                    │                                          │             │
                    │                                          │             │
          ┌─────────▼────────┐                    ┌───────────▼────────┐   │
          │ Loading         │                    │ Result             │   │
          │ app/loading.tsx │                    │ app/result.tsx     │   │
          │                 │                    │                    │   │
          │ - useEffect()   │                    │ - score            │   │
          │ - calculate()   │                    │ - explanation      │   │
          │   (calculateCompatibility)│          │ - salData          │   │
          └─────────┬────────┘                    │ - OctagonGraph    │   │
                    │                             │ - navigateToAI()  │   │
                    │                             └───────────┬────────┘   │
                    │                                          │             │
                    │                                          │             │
          ┌─────────▼────────┐                    ┌───────────▼────────┐   │
          │ Result           │                    │ AIAdvice          │   │
          │ app/result.tsx   │                    │ app/ai-advice.tsx │   │
          │                  │                    │                    │   │
          │ - score          │                    │ - advice           │   │
          │ - saju1, saju2   │                    │ - tips             │   │
          │ - salAnalysis    │                    │ - summary          │   │
          │ - OctagonGraph   │                    │ - getAIAdvice()    │   │
          └──────────────────┘                    └────────────────────┘   │
                                                                             │
                                                                             │
  ┌─────────────────────────────────────────────────────────────────────────┤
  │                                                                         │
  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐          │
  │  │ AppHeader      │  │ OctagonGraph   │  │ DatePicker     │          │
  │  │ components/    │  │ components/    │  │ components/    │          │
  │  │                │  │                │  │                │          │
  │  │ - title        │  │ - salData      │  │ - value        │          │
  │  │ - showHomeBtn  │  │ - renderGraph()│  │ - onChange()    │          │
  │  │ - showAuthBtn  │  │                │  └────────────────┘          │
  │  └────────────────┘  └────────────────┘                              │
  │                                                                         │
  │  ┌────────────────┐  ┌────────────────┐                              │
  │  │ TimePicker     │  │ ThemedText     │                              │
  │  │ components/    │  │ components/    │                              │
  │  │                │  │                │                              │
  │  │ - value        │  │ - type         │                              │
  │  │ - onChange()   │  │ - style        │                              │
  │  └────────────────┘  └────────────────┘                              │
  │                                                                         │
  │  ┌────────────────┐                                                    │
  │  │ ThemedView     │                                                    │
  │  │ components/    │                                                    │
  │  │                │                                                    │
  │  │ - style        │                                                    │
  │  └────────────────┘                                                    │
  │                                                                         │
  │  ┌────────────────────────────────────────────────────────────┐      │
  │  │ Utils                                                         │      │
  │  │                                                               │      │
  │  │  apiClient.ts                                                 │      │
  │  │    ├─ apiRequest()                                            │      │
  │  │    ├─ getAuthToken()                                          │      │
  │  │    ├─ setAuthToken()                                          │      │
  │  │    ├─ authAPI {                                               │      │
  │  │    │    ├─ login()                                            │      │
  │  │    │    ├─ signup()                                            │      │
  │  │    │    ├─ logout()                                            │      │
  │  │    │    ├─ getProfile()                                        │      │
  │  │    │    └─ updateProfile()                                    │      │
  │  │    └─ aiAPI {                                                 │      │
  │  │         └─ getAdvice()                                        │      │
  │  │                                                               │      │
  │  │  sajuCalculator.ts                                            │      │
  │  │    ├─ calculateSaju()                                         │      │
  │  │    ├─ analyzeSal() (내부 함수)                                │      │
  │  │    └─ calculateCompatibility()                                 │      │
  │  │                                                               │      │
  │  │  aiService.ts                                                 │      │
  │  │    ├─ getAIAdvice()                                           │      │
  │  │    └─ getAIAdviceGemini()                                     │      │
  │  └────────────────────────────────────────────────────────────┘      │
  └─────────────────────────────────────────────────────────────────────┘
```

#### 주요 컴포넌트 설명

**Context (전역 상태 관리)**
- `AuthContext`: 사용자 인증 상태, 로그인/로그아웃, 프로필 관리
- `UserDataContext`: 사용자 입력 데이터(이름, 생년월일 등), 궁합 결과 저장

**화면 컴포넌트**
- `Home`: 앱 메인 화면, 궁합문어 로고, 살 설명, 입력 버튼
- `Input`: 사용자 사주 정보 입력 폼
- `Loading`: 사주 계산 중 로딩 화면
- `Result`: 궁합 분석 결과 표시, 점수, 그래프, AI 조언 버튼
- `AIAdvice`: AI 조언 표시 화면
- `Login/Signup`: 로그인/회원가입 화면
- `Profile`: 내 정보 관리 화면

**UI 컴포넌트**
- `AppHeader`: 상단 헤더, 로고, 인증 버튼
- `OctagonGraph`: 팔각형 방사형 그래프 (8개 살 시각화)
- `DatePicker/TimePicker`: 날짜/시간 선택 컴포넌트
- `ThemedText/ThemedView`: 테마 적용 컴포넌트

**유틸리티**
- `apiClient`: 백엔드 API 호출, 인증 토큰 관리
- `sajuCalculator`: 사주 계산 로직 (간지 변환, 살 분석, 점수 계산)
- `aiService`: AI 조언 요청 로직

---

### 백엔드 상세 설계 (Class Diagram)

백엔드는 Node.js와 Express를 사용하여 RESTful API를 제공합니다.

#### 백엔드 서버 구조

```
                    ┌─────────────────────────────────────┐
                    │  Express Server                     │
                    │  backend/server.js                  │
                    │  Port: 3000 (기본값)                │
                    └────────────┬────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
        ┌───────────▼──────────┐    ┌───────────▼──────────┐
        │  Middleware          │    │  Routes              │
        │  server.js:13-15     │    │  server.js:17-196    │
        │                      │    │                      │
        │  - cors()            │    │  GET  /              │
        │    (CORS 허용)        │    │       └─ 상태 확인    │
        │  - express.json()    │    │                      │
        │    (JSON 파싱)        │    │  POST /api/ai-advice │
        └──────────────────────┘    │       ├─ 입력 검증    │
                                     │       ├─ OpenAI 호출 │
                                     │       ├─ 기본 조언    │
                                     │       └─ 응답 반환    │
                                     │                      │
                                     │  POST /api/auth/login │
                                     │       ├─ 입력 검증    │
                                     │       ├─ 인증 처리    │
                                     │       └─ 토큰 발급    │
                                     │       (DB 조회 예정)  │
                                     │                      │
                                     │  POST /api/auth/signup│
                                     │       ├─ 입력 검증    │
                                     │       ├─ 회원가입     │
                                     │       └─ 토큰 발급    │
                                     │       (DB 저장 예정)  │
                                     │                      │
                                     │  GET  /api/auth/profile│
                                     │       ├─ 토큰 검증     │
                                     │       └─ 프로필 반환  │
                                     │       (DB 조회 예정)  │
                                     │                      │
                                     │  PUT  /api/auth/profile│
                                     │       ├─ 토큰 검증     │
                                     │       ├─ 입력 검증     │
                                     │       └─ 프로필 반환  │
                                     │       (DB 업데이트 예정)│
                                     └───────────┬──────────┘
                                                 │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
        ┌───────────▼──────────┐    ┌───────────▼──────────┐    ┌───────────▼──────────┐
        │  Helper Functions    │    │  OpenAI Service      │    │  Database (예정)     │
        │  server.js:198-285   │    │  server.js:49-69     │    │                      │
        │                      │    │                      │    │  User Model          │
        │  - generatePrompt()   │    │  - OpenAI 인스턴스    │    │    - _id             │
        │    (프롬프트 생성)     │    │  - apiKey (환경변수)  │    │    - email (unique)  │
        │  - parseAIResponse()  │    │  - chat.completions  │    │    - password (hash) │
        │    (응답 파싱)        │    │    .create()         │    │    - name             │
        │  - getDefaultAdvice() │    │  - model: gpt-3.5-turbo│  │    - profile {        │
        │    (기본 조언)        │    │  - max_tokens: 500   │    │        name          │
        │  - getDefaultTips()   │    │  - temperature: 0.7  │    │        birthDate     │
        │    (기본 팁)          │    └──────────────────────┘    │        birthTime     │
        └──────────────────────┘                                │        gender        │
                                                                │      }               │
                                                                │    - createdAt       │
                                                                │    - updatedAt       │
                                                                │                      │
                                                                │  CompatibilityResult│
                                                                │    - _id             │
                                                                │    - userId (ref)    │
                                                                │    - user1, user2    │
                                                                │    - score           │
                                                                │    - salAnalysis     │
                                                                │    - createdAt       │
                                                                └──────────────────────┘
                    │
        ┌───────────▼──────────┐
        │  Environment Vars   │
        │  backend/.env        │
        │                      │
        │  - PORT              │ → process.env.PORT (server.js:11)
        │  - OPENAI_API_KEY    │ → process.env.OPENAI_API_KEY (server.js:36)
        │  - DATABASE_URL (예정)│ → process.env.DATABASE_URL (향후)
        │  - JWT_SECRET (예정) │ → process.env.JWT_SECRET (향후)
        │                      │
        │  dotenv.config()     │ → require('dotenv').config() (server.js:8)
        └──────────────────────┘
```

#### 주요 모듈 설명

**Express Application**
- 미들웨어: CORS 설정, JSON 파싱
- 라우트: API 엔드포인트 정의
- 서버 포트: 3000 (기본값)

**API 엔드포인트**
- `GET /`: 서버 상태 확인
- `POST /api/ai-advice`: AI 조언 생성
- `POST /api/auth/login`: 사용자 로그인
- `POST /api/auth/signup`: 사용자 회원가입
- `GET /api/auth/profile`: 프로필 조회
- `PUT /api/auth/profile`: 프로필 업데이트

**외부 서비스**
- OpenAI Service: OpenAI API와 통신 (API 키 보관)
- Database (향후 구현): MongoDB/PostgreSQL 연동 예정

**데이터베이스 스키마 (향후 구현)**
- User Model: 사용자 계정 및 프로필 정보
- CompatibilityResult Model (선택): 궁합 결과 히스토리

---

## 라이선스

이 프로젝트는 개인 프로젝트입니다.
