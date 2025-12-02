/**
 * 플랫폼별 알림 유틸리티
 * - 웹: window.alert 사용
 * - 모바일: React Native Alert 사용
 */
import { Platform, Alert } from 'react-native';

/**
 * 알림 팝업 표시
 * @param title 제목
 * @param message 메시지
 * @param buttons 버튼 배열 (웹에서는 무시됨)
 */
export function showAlert(
  title: string,
  message?: string,
  buttons?: Array<{ text: string; onPress?: () => void }>
) {
  if (Platform.OS === 'web') {
    // 웹에서는 window.alert 사용
    const fullMessage = message ? `${title}\n\n${message}` : title;
    window.alert(fullMessage);
    
    // 버튼이 있고 onPress가 있으면 실행
    if (buttons && buttons.length > 0) {
      const firstButton = buttons[0];
      if (firstButton.onPress) {
        // alert가 닫힌 후 실행
        setTimeout(() => {
          firstButton.onPress?.();
        }, 100);
      }
    }
  } else {
    // 모바일에서는 React Native Alert 사용
    if (buttons && buttons.length > 0) {
      Alert.alert(title, message, buttons);
    } else {
      Alert.alert(title, message);
    }
  }
}

