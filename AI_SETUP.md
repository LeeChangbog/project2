# AI 조언 기능 설정 가이드

## 개요

이 앱은 OpenAI API를 사용하여 궁합 결과에 대한 AI 조언을 제공합니다. API 키가 설정되지 않아도 기본 조언을 제공합니다.

## API 키 설정 방법

### 1. OpenAI API 키 발급

1. [OpenAI 웹사이트](https://platform.openai.com/)에 접속
2. 계정 생성 또는 로그인
3. API Keys 페이지로 이동
4. "Create new secret key" 클릭하여 API 키 생성
5. 생성된 키를 복사 (한 번만 표시되므로 안전하게 보관)

### 2. 환경 변수 설정

#### 방법 1: `.env` 파일 사용 (권장)

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-api-key-here
```

**주의**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

#### 방법 2: `app.json`에 직접 설정 (비권장)

`app.json`의 `expo.extra` 섹션에 추가:

```json
{
  "expo": {
    "extra": {
      "openaiApiKey": "sk-your-api-key-here"
    }
  }
}
```

⚠️ **보안 주의**: 이 방법은 API 키가 코드에 노출되므로 권장하지 않습니다.

### 3. 환경 변수 사용

코드에서 환경 변수 접근:

```typescript
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
```

## 대안: Gemini API 사용

OpenAI 대신 Google Gemini API를 사용할 수도 있습니다:

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키 발급
2. `.env` 파일에 추가:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

3. `app/ai-advice.tsx`에서 `getAIAdviceGemini` 함수 사용:

```typescript
import { getAIAdviceGemini } from '@/utils/aiService';

// getAIAdvice 대신 getAIAdviceGemini 사용
const adviceData = await getAIAdviceGemini({...});
```

## API 키 없이 사용하기

API 키가 설정되지 않은 경우, 기본 조언이 제공됩니다:

- 점수에 따른 기본 조언
- 일반적인 관계 개선 팁
- 감점 요소에 대한 조언

기본 조언도 유용하지만, AI 조언은 더 개인화되고 구체적입니다.

## 비용 정보

### OpenAI API
- GPT-3.5-turbo: $0.0015 per 1K input tokens, $0.002 per 1K output tokens
- 조언 한 번당 약 $0.002-0.005 정도 소요

### Gemini API
- 무료 할당량 제공 (월별 제한)
- 상세한 가격은 [Google AI 가격 정책](https://ai.google.dev/pricing) 참고

## 문제 해결

### API 키가 작동하지 않는 경우

1. API 키가 올바르게 설정되었는지 확인
2. `.env` 파일이 프로젝트 루트에 있는지 확인
3. 앱을 재시작 (환경 변수 변경 후 재시작 필요)
4. Expo 개발 서버 재시작: `npm start --clear`

### API 오류 발생 시

- API 키가 유효한지 확인
- API 할당량이 남아있는지 확인
- 네트워크 연결 확인
- 오류 발생 시 기본 조언으로 자동 전환됩니다

## 보안 권장사항

1. ✅ `.env` 파일을 `.gitignore`에 포함
2. ✅ API 키를 GitHub에 커밋하지 않기
3. ✅ 프로덕션에서는 백엔드 서버를 통해 API 호출 권장
4. ✅ API 키 사용량 모니터링

## 추가 기능 개발

프로덕션 환경에서는 다음을 권장합니다:

1. **백엔드 서버 구축**: API 키를 서버에서 관리
2. **사용량 제한**: 사용자당 일일 조언 횟수 제한
3. **캐싱**: 동일한 결과에 대한 조언 캐싱
4. **로깅**: API 호출 로그 관리

