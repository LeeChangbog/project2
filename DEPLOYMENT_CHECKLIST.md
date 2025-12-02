# 배포 환경 체크리스트

## 로컬 vs 배포 환경 차이점

### 1. API URL 설정
- **로컬**: `http://localhost:3000` (기본값)
- **배포**: `window.location.origin` 또는 `EXPO_PUBLIC_API_BASE_URL` 환경 변수

**확인 사항:**
- 배포 환경에서 `EXPO_PUBLIC_API_BASE_URL` 환경 변수가 설정되어 있는지 확인
- 백엔드 서버가 실제로 실행 중인지 확인
- CORS 설정이 올바른지 확인

### 2. 백엔드 API 사용 여부
- **로컬**: `EXPO_PUBLIC_USE_BACKEND_API=true` 환경 변수 필요
- **배포**: 자동으로 백엔드 API 사용 (프로덕션 환경 감지)

**확인 사항:**
- 배포 환경에서 백엔드 서버가 실행 중인지 확인
- 백엔드 서버의 포트와 URL이 올바른지 확인

### 3. Python 환경
- **로컬**: Python 패키지 설치 필요 (`numpy`, `tensorflow`)
- **배포**: 배포 서버에도 Python 패키지 설치 필요

**확인 사항:**
- 배포 서버에 Python이 설치되어 있는지 확인
- `pip install numpy tensorflow` 실행 여부 확인
- `backend/requirements.txt` 파일 확인

### 4. 모델 파일
- **로컬**: `backend/sky3000.h5`, `backend/earth3000.h5` 존재
- **배포**: 배포 서버에도 동일한 파일 존재 필요

**확인 사항:**
- 배포 서버에 모델 파일이 업로드되어 있는지 확인
- 파일 경로가 올바른지 확인

### 5. MongoDB 연결
- **로컬**: `.env` 파일에 `MONGODB_URI` 설정
- **배포**: 배포 서버 환경 변수에 `MONGODB_URI` 설정

**확인 사항:**
- 배포 서버의 환경 변수에 MongoDB 연결 문자열이 설정되어 있는지 확인
- MongoDB 연결이 정상적으로 작동하는지 확인

### 6. 환경 변수 설정 (배포 환경)

배포 환경에서 설정해야 할 환경 변수:

```bash
# 프론트엔드 (Expo)
EXPO_PUBLIC_USE_BACKEND_API=true
EXPO_PUBLIC_API_BASE_URL=https://your-backend-domain.com

# 백엔드
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
PORT=3000
```

## 문제 해결 방법

### 문제 1: API 호출 실패
- 브라우저 콘솔에서 네트워크 오류 확인
- 백엔드 서버 로그 확인
- CORS 설정 확인

### 문제 2: Python 스크립트 실행 실패
- 배포 서버에 Python 설치 확인
- `pip install -r backend/requirements.txt` 실행
- 모델 파일 존재 확인

### 문제 3: MongoDB 연결 실패
- 배포 서버 환경 변수 확인
- MongoDB Atlas IP 화이트리스트 확인
- 연결 문자열 형식 확인

### 문제 4: 환경 변수가 적용되지 않음
- Expo 빌드 후 환경 변수는 빌드 시점에 포함됨
- 환경 변수 변경 후 재빌드 필요
- `expo export:web` 또는 배포 플랫폼의 빌드 명령 재실행

