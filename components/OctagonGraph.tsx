/**
 * 팔각형 방사형 그래프 컴포넌트
 * - 8개의 '살'을 팔각형 형태로 시각화
 * - 웹에서는 HTML SVG 사용, 모바일에서는 react-native-svg 사용
 * - 각 살의 값에 따라 꼭짓점의 거리가 달라짐
 * - 각 살 항목에 툴팁으로 설명 제공
 */
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

/**
 * 살 데이터 타입
 */
interface SalData {
  name: string;        // 살 이름 (예: '충살', '형살')
  value: number;      // 살의 값 (0-100%)
  description: string; // 살에 대한 설명
}

interface OctagonGraphProps {
  salData: SalData[];  // 8개의 살 데이터 배열
}

// 그래프 상수
const maxValue = 100;  // 최대값 (100%)
const centerX = 150;   // 그래프 중심 X 좌표
const centerY = 150;   // 그래프 중심 Y 좌표
const radius = 120;    // 그래프 반지름

export function OctagonGraph({ salData }: OctagonGraphProps) {
  // 호버/터치된 살의 인덱스 (툴팁 표시용)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  /**
   * 팔각형의 각 꼭짓점 좌표 계산
   * @param index 살의 인덱스 (0-7)
   * @param value 살의 값 (0-100)
   * @returns 꼭짓점의 x, y 좌표
   */
  const getPoint = (index: number, value: number) => {
    const angle = (index * Math.PI * 2) / 8 - Math.PI / 2;
    const distance = (value / maxValue) * radius;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    return { x, y };
  };

  // 팔각형 경로 생성 (SVG path 데이터)
  const points = salData.map((item, index) => getPoint(index, item.value));
  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ') + ' Z';

  /**
   * 격자선 그리기 (5단계)
   * - 그래프를 5단계로 나눠서 가독성 향상
   */
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const r = (radius * (i + 1)) / 5;
    const gridPoints = Array.from({ length: 8 }, (_, j) => {
      const angle = (j * Math.PI * 2) / 8 - Math.PI / 2;
      return {
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
      };
    });
    const gridPath = gridPoints
      .map((point, j) => `${j === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z';
    return { path: gridPath, level: i + 1 };
  });

  /**
   * 축선 그리기 (8개 방향)
   * - 각 살의 위치를 나타내는 선
   */
  const axes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + Math.cos(angle) * radius,
      y2: centerY + Math.sin(angle) * radius,
    };
  });

  /**
   * 각 꼭짓점의 라벨 위치 계산
   * - 살 이름을 그래프 외곽에 표시
   */
  const labelPositions = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
    const labelRadius = radius + 25;
    return {
      x: centerX + Math.cos(angle) * labelRadius,
      y: centerY + Math.sin(angle) * labelRadius,
      angle: angle,
    };
  });

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.graphWrapper}>
          <svg width="300" height="300" viewBox="0 0 300 300" style={styles.svg}>
            {/* 배경 원 */}
            <circle cx={centerX} cy={centerY} r={radius} fill="#FFF8F0" stroke="#D4C4B0" strokeWidth="2" opacity="0.3" />
            
            {/* 격자선 */}
            {gridLines.map((grid, i) => (
              <path
                key={i}
                d={grid.path}
                fill="none"
                stroke="#E8D5C4"
                strokeWidth="1"
                opacity="0.4"
              />
            ))}
            
            {/* 축선 */}
            {axes.map((axis, i) => (
              <line
                key={i}
                x1={axis.x1}
                y1={axis.y1}
                x2={axis.x2}
                y2={axis.y2}
                stroke="#D4C4B0"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
            
            {/* 데이터 영역 (팔각형) */}
            <path
              d={pathData}
              fill={tintColor}
              fillOpacity="0.3"
              stroke={tintColor}
              strokeWidth="2"
            />
            
            {/* 데이터 포인트 */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={tintColor}
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
            
            {/* 라벨 */}
            {labelPositions.map((label, i) => (
              <text
                key={i}
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fill="#8B6F47"
                fontWeight="600"
                style={{ userSelect: 'none' }}
              >
                {salData[i]?.name || ''}
              </text>
            ))}
          </svg>
        </View>
        
        {/* 살 항목 리스트 */}
        <View style={styles.salItems}>
          {salData.map((item, index) => (
            <View
              key={index}
              style={styles.salItem}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}>
              <View style={styles.salItemHeader}>
                <ThemedText style={styles.salName} numberOfLines={1}>
                  {item.name}
                </ThemedText>
                <View style={styles.infoIconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setHoveredIndex(hoveredIndex === index ? null : index);
                    }}
                    style={styles.infoIconButton}>
                    <IconSymbol
                      name="info.circle"
                      size={16}
                      color={hoveredIndex === index ? tintColor : '#999'}
                    />
                  </TouchableOpacity>
                  {hoveredIndex === index && (
                    <View style={styles.tooltip}>
                      <ThemedText style={styles.tooltipText} numberOfLines={4}>
                        {item.description}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.barContainer}>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: `${Math.min(item.value, 100)}%` }]} />
                </View>
                <ThemedText style={styles.barValue}>{Math.round(item.value)}%</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // 모바일에서도 SVG 그래프 표시
  return (
    <View style={styles.container}>
      <View style={styles.graphWrapper}>
        <Svg width="300" height="300" viewBox="0 0 300 300" style={styles.svg}>
          {/* 배경 원 */}
          <Circle cx={centerX} cy={centerY} r={radius} fill="#FFF8F0" stroke="#D4C4B0" strokeWidth="2" opacity="0.3" />
          
          {/* 격자선 */}
          {gridLines.map((grid, i) => (
            <Path
              key={i}
              d={grid.path}
              fill="none"
              stroke="#E8D5C4"
              strokeWidth="1"
              opacity="0.4"
            />
          ))}
          
          {/* 축선 */}
          {axes.map((axis, i) => (
            <Line
              key={i}
              x1={axis.x1}
              y1={axis.y1}
              x2={axis.x2}
              y2={axis.y2}
              stroke="#D4C4B0"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* 데이터 영역 (팔각형) */}
          <Path
            d={pathData}
            fill={tintColor}
            fillOpacity="0.3"
            stroke={tintColor}
            strokeWidth="2"
          />
          
          {/* 데이터 포인트 */}
          {points.map((point, i) => (
            <Circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={tintColor}
              stroke="#fff"
              strokeWidth="2"
            />
          ))}
          
          {/* 라벨 */}
          {labelPositions.map((label, i) => (
            <SvgText
              key={i}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              fontSize="11"
              fill="#8B6F47"
              fontFamily="System"
            >
              {salData[i]?.name || ''}
            </SvgText>
          ))}
        </Svg>
      </View>
      
      {/* 살 항목 리스트 */}
      <View style={styles.salItems}>
        {salData.map((item, index) => (
          <View key={index} style={styles.salItem}>
            <View style={styles.salItemHeader}>
              <ThemedText style={styles.salName} numberOfLines={1}>
                {item.name}
              </ThemedText>
              <View style={styles.infoIconContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setHoveredIndex(hoveredIndex === index ? null : index);
                  }}
                  style={styles.infoIconButton}>
                  <IconSymbol
                    name="info.circle"
                    size={16}
                    color={hoveredIndex === index ? tintColor : '#999'}
                  />
                </TouchableOpacity>
                {hoveredIndex === index && (
                  <View style={styles.tooltip}>
                    <ThemedText style={styles.tooltipText} numberOfLines={4}>
                      {item.description}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.barContainer}>
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${Math.min(item.value, 100)}%` }]} />
              </View>
              <ThemedText style={styles.barValue}>{Math.round(item.value)}%</ThemedText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  graphWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 20,
  },
  svg: {
    width: '100%',
    height: '100%',
    maxWidth: 300,
    maxHeight: 300,
  },
  graphPlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: '#D4C4B0',
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E8D5C4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(232, 213, 196, 0.3)',
      },
    }),
  },
  graphNote: {
    textAlign: 'center',
    opacity: 0.7,
    color: '#8B6F47',
  },
  salItems: {
    gap: 15,
    width: '100%',
  },
  salItem: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#E8D5C4',
    ...Platform.select({
      web: {
        position: 'relative',
        boxShadow: '0 1px 3px rgba(232, 213, 196, 0.15)',
        cursor: 'pointer',
      },
    }),
  },
  salItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B6F47',
  },
  infoIcon: {
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  infoIconContainer: {
    position: 'relative',
    zIndex: 10,
  },
  infoIconButton: {
    padding: 4,
  },
  tooltip: {
    position: 'absolute',
    bottom: 35,
    right: 0,
    backgroundColor: '#5C4033',
    padding: 12,
    borderRadius: 12,
    minWidth: 200,
    maxWidth: 250,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#8B6F47',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(92, 64, 51, 0.4)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
      },
    }),
  },
  tooltipText: {
    color: '#F5E6D3',
    fontSize: 12,
    lineHeight: 18,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#E8D5C4',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#C9A961',
    borderRadius: 5,
    minWidth: 0,
    shadowColor: '#8B6F47',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    color: '#8B6F47',
    textAlign: 'right',
  },
});

