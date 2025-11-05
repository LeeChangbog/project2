/**
 * 앱 헤더 컴포넌트
 * - 모든 화면 상단에 표시되는 헤더
 * - '사주문어' 앱 이름 표시
 * - 웹에서는 스크롤해도 상단에 고정 (sticky)
 * - 홈 화면이 아닐 때 홈 버튼 표시
 * - 현재 페이지 제목 표시 (선택적)
 */
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePathname, useRouter } from 'expo-router';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

interface AppHeaderProps {
  title?: string;              // 페이지 제목 (선택적)
  showHomeButton?: boolean;    // 홈 버튼 표시 여부 (기본값: true)
}

export function AppHeader({ title, showHomeButton = true }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  // 현재 화면이 홈 화면인지 확인
  const isHome = pathname === '/(tabs)' || pathname === '/';

  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        {/* 홈 버튼: 홈 화면이 아니고 showHomeButton이 true일 때만 표시 */}
        {showHomeButton && !isHome && (
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push('/(tabs)')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <IconSymbol name="house.fill" size={22} color={tintColor} />
          </TouchableOpacity>
        )}
        {/* 앱 이름: '사주문어' */}
        <ThemedText type="title" style={styles.appName}>
          사주문어
        </ThemedText>
        {/* 페이지 제목: title이 제공된 경우에만 표시 */}
        {title && (
          <ThemedText style={styles.pageTitle} numberOfLines={1}>
            {title}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: Platform.OS === 'web' ? 12 : 40,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF8F0',
    borderBottomWidth: 2,
    borderBottomColor: '#D4C4B0',
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(232, 213, 196, 0.1)',
      },
      default: {
        zIndex: 100,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  homeButton: {
    padding: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B6F47',
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B6F47',
    flex: 1,
    marginLeft: 8,
  },
});

