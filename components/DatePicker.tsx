/**
 * 날짜 선택 컴포넌트
 * - 웹: HTML5 date input 사용 (달력 UI 제공)
 * - 모바일: TextInput으로 직접 입력 (YYYY-MM-DD 형식)
 * - 입력 시 자동으로 YYYY-MM-DD 형식으로 포맷팅
 */
import { Platform, StyleSheet, TextInput } from 'react-native';

interface DatePickerProps {
  value: string;                      // 현재 날짜 값 (YYYY-MM-DD 형식)
  onChange: (date: string) => void;  // 날짜 변경 시 호출되는 함수
  placeholder?: string;               // 플레이스홀더 텍스트
  colorScheme?: 'light' | 'dark';     // 다크 모드 여부
}

export function DatePicker({ value, onChange, placeholder, colorScheme }: DatePickerProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // 이미 YYYY-MM-DD 형식이면 그대로 사용
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // 그 외의 경우 Date 객체로 변환
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      // 변환 실패 시 빈 문자열 반환
    }
    return '';
  };

  const handleDateChange = (event: any) => {
    const selectedDate = event.target.value;
    if (selectedDate) {
      // YYYY-MM-DD 형식으로 직접 전달
      onChange(selectedDate);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <input
        type="date"
        value={formatDate(value)}
        onChange={handleDateChange}
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
      placeholder={placeholder || 'YYYY-MM-DD'}
      placeholderTextColor={colorScheme === 'dark' ? '#8B7355' : '#B8A082'}
      value={value}
      onChangeText={(text) => {
        // 날짜 형식 검증 및 포맷팅
        // 숫자와 하이픈만 허용
        let formatted = text.replace(/[^\d-]/g, '');
        
        // YYYY-MM-DD 형식으로 자동 포맷팅
        if (formatted.length > 4 && formatted[4] !== '-') {
          formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
        }
        if (formatted.length > 7 && formatted[7] !== '-') {
          formatted = formatted.slice(0, 7) + '-' + formatted.slice(7);
        }
        
        // 최대 길이 제한 (YYYY-MM-DD = 10자)
        if (formatted.length > 10) {
          formatted = formatted.slice(0, 10);
        }
        
        onChange(formatted);
      }}
      keyboardType="numeric"
      maxLength={10}
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

