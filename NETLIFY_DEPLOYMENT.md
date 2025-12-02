# Netlify 배포 가이드

## 📋 사전 준비

1. **백엔드 서버 배포**
   - 백엔드는 별도로 배포해야 합니다 (Netlify는 프론트엔드만 호스팅)
   - 추천: Railway, Render, Heroku, AWS, Vercel 등
   - 백엔드 URL을 준비하세요 (예: `https://your-backend-api.railway.app`)

2. **GitHub 저장소 준비**
   - 코드가 GitHub에 푸시되어 있어야 합니다

## 🚀 Netlify 배포 단계

### 1단계: Netlify에 사이트 추가

1. [Netlify](https://www.netlify.com/)에 로그인
2. "Add new site" > "Import an existing project" 클릭
3. GitHub 저장소 선택
4. 브랜치 선택 (보통 `main` 또는 `master`)

### 2단계: 빌드 설정

Netlify가 자동으로 `netlify.toml` 파일을 인식합니다:

- **Build command**: `npm run build:web`
- **Publish directory**: `web-build`

### 3단계: 환경 변수 설정 (중요!)

**Site settings > Environment variables**에서 다음 환경 변수를 추가하세요:

#### 필수 환경 변수:

```
EXPO_PUBLIC_API_BASE_URL=https://your-backend-api.com
EXPO_PUBLIC_USE_BACKEND_API=true
```

**예시:**
- 백엔드가 Railway에 배포된 경우: `https://your-app.railway.app`
- 백엔드가 Render에 배포된 경우: `https://your-app.onrender.com`
- 백엔드가 Vercel에 배포된 경우: `https://your-app.vercel.app`

### 4단계: 배포

1. "Deploy site" 버튼 클릭
2. 빌드가 완료될 때까지 대기 (약 2-5분)
3. 배포 완료 후 사이트 URL 확인

## ⚙️ 백엔드 CORS 설정 확인

백엔드 서버의 CORS 설정이 Netlify 도메인을 허용하는지 확인하세요:

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:8082',
    'https://your-netlify-site.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

또는 모든 도메인 허용 (개발용):

```javascript
app.use(cors()); // 모든 도메인 허용
```

## 🔍 배포 후 확인 사항

1. **환경 변수 확인**
   - 브라우저 콘솔에서 `console.log(process.env.EXPO_PUBLIC_API_BASE_URL)` 확인
   - 또는 Network 탭에서 API 요청 URL 확인

2. **API 연결 테스트**
   - 로그인/회원가입 기능 테스트
   - 궁합 계산 기능 테스트
   - AI 조언 기능 테스트

3. **에러 확인**
   - 브라우저 콘솔에서 에러 메시지 확인
   - Netlify Functions 로그 확인 (있는 경우)

## 🐛 문제 해결

### 문제 1: API 요청이 404 오류 발생
- **원인**: `EXPO_PUBLIC_API_BASE_URL`이 설정되지 않았거나 잘못됨
- **해결**: Netlify 환경 변수에서 올바른 백엔드 URL 설정

### 문제 2: CORS 오류 발생
- **원인**: 백엔드 CORS 설정에 Netlify 도메인이 포함되지 않음
- **해결**: 백엔드 `server.js`의 CORS 설정에 Netlify 도메인 추가

### 문제 3: 빌드 실패
- **원인**: 의존성 설치 오류 또는 빌드 스크립트 오류
- **해결**: 
  - Netlify 빌드 로그 확인
  - 로컬에서 `npm run build:web` 실행하여 오류 확인

## 📝 참고 사항

- Netlify는 정적 사이트 호스팅이므로 백엔드는 별도로 배포해야 합니다
- 환경 변수는 빌드 시점에 주입되므로, 변경 후 재배포가 필요합니다
- 커스텀 도메인 설정도 가능합니다 (Netlify 대시보드에서 설정)

