# Expo 캐시 문제 해결 방법

Expo에서 변경사항이 반영되지 않을 때 다음 방법을 시도해보세요:

## 방법 1: 캐시를 지우고 재시작 (권장)

```bash
npm run start:clear
```

또는 웹의 경우:
```bash
npm run web:clear
```

## 방법 2: 수동으로 캐시 지우기

터미널에서 다음 명령어를 실행하세요:

```bash
# Metro bundler 캐시 지우기
npx expo start --clear

# 또는 더 강력한 캐시 클리어
npx expo start -c
```

## 방법 3: 완전히 재시작

1. 현재 실행 중인 Expo 서버를 중지 (Ctrl+C)
2. 다음 명령어로 캐시 완전히 지우기:
```bash
# .expo 폴더 삭제 (프로젝트 루트에서)
rm -rf .expo

# node_modules/.cache 삭제 (있는 경우)
rm -rf node_modules/.cache

# Metro bundler 캐시 지우기
npx expo start --clear
```

## 방법 4: 웹 브라우저 캐시 지우기

웹에서 실행 중이라면:
- 브라우저에서 하드 리프레시: `Ctrl+Shift+R` (Windows) 또는 `Cmd+Shift+R` (Mac)
- 또는 개발자 도구(F12)에서 "캐시 비우기 및 강력 새로고침"

## 방법 5: 앱 재로드

Expo Go 앱이나 웹 브라우저에서:
- 흔들기 제스처 (물리 기기) 또는 `Ctrl+M` (에뮬레이터)로 개발자 메뉴 열기
- "Reload" 선택

## 문제가 계속되면

다음 명령어로 완전히 재설정:
```bash
# 모든 캐시 삭제
rm -rf .expo
rm -rf node_modules/.cache

# 패키지 재설치 (선택사항)
rm -rf node_modules
npm install

# 개발 서버 시작
npx expo start --clear
```

