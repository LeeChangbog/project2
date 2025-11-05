/**
 * 시간 선택 컴포넌트
 * - 웹: HTML5 time input 사용 (시간 선택 UI 제공)
 * - 모바일: TextInput으로 직접 입력 (HH:MM 형식)
 * - 입력 시 자동으로 HH:MM 형식으로 포맷팅
 * - 시간 범위 검증 (00:00 ~ 23:59)
 */
import { Platform, StyleSheet, TextInput } from 'react-native';

interface TimePickerProps {
  value: string;                      // 현재 시간 값 (HH:MM 형식)
  onChange: (time: string) => void;  // 시간 변경 시 호출되는 함수
  placeholder?: string;               // 플레이스홀더 텍스트
  colorScheme?: 'light' | 'dark';     // 다크 모드 여부
}

export function TimePicker({ value, onChange, placeholder, colorScheme }: TimePickerProps) {
  if (Platform.OS === 'web') {
    return (
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: '#D4C4B0',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          color: colorScheme === 'dark' ? '#F5E6D3' : '#5C4033',
          outline: 'none',
          boxShadow: '0 1px 3px rgba(212, 196, 176, 0.1)',
        }}
      />
    );
  }

  // 모바일에서는 TextInput으로 직접 입력
  return (
    <TextInput
      style={[
        styles.input,
        { 
          borderColor: '#D4C4B0', 
          backgroundColor: '#FFFFFF',
          color: colorScheme === 'dark' ? '#F5E6D3' : '#5C4033',
        },
      ]}
      placeholder={placeholder || 'HH:MM'}
      placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
      value={value}
      onChangeText={(text) => {
        // 시간 형식 검증 및 포맷팅
        // 숫자와 콜론만 허용
        let formatted = text.replace(/[^\d:]/g, '');
        
        // HH:MM 형식으로 자동 포맷팅
        if (formatted.length > 2 && formatted[2] !== ':') {
          formatted = formatted.slice(0, 2) + ':' + formatted.slice(2);
        }
        
        // 최대 길이 제한 (HH:MM = 5자)
        if (formatted.length > 5) {
          formatted = formatted.slice(0, 5);
        }
        
        // 시간 범위 검증 (00:00 ~ 23:59)
        const timeParts = formatted.split(':');
        if (timeParts.length === 2) {
          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);
          if (!isNaN(hours) && hours > 23) {
            formatted = '23' + ':' + timeParts[1];
          }
          if (!isNaN(minutes) && minutes > 59) {
            formatted = timeParts[0] + ':' + '59';
          }
        }
        
        onChange(formatted);
      }}
      keyboardType="numeric"
      maxLength={5}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 48,
  },
});

