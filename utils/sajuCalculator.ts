/**
 * 사주 팔자 계산 유틸리티
 * 생년월일시를 기반으로 사주를 계산하고 궁합을 분석합니다.
 */

// 천간 (10개)
const GAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
// 지지 (12개)
const JI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
// 오행 매핑
const ELEMENT_MAP: { [key: string]: string } = {
  '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토',
  '기': '토', '경': '금', '신': '금', '임': '수', '계': '수',
  '인': '목', '묘': '목', '사': '화', '오': '화', '진': '토', '술': '토',
  '축': '토', '미': '토', '신': '금', '유': '금', '해': '수', '자': '수',
};

// 오행 상생/상극 관계
const ELEMENT_RELATIONS = {
  상생: { // 생성 관계
    '목': '화',
    '화': '토',
    '토': '금',
    '금': '수',
    '수': '목',
  },
  상극: { // 극제 관계
    '목': '토',
    '화': '금',
    '토': '수',
    '금': '목',
    '수': '화',
  },
};

// 십이지충 (충돌 관계)
const CHUNG_RELATIONS: { [key: string]: string } = {
  '자': '오', '축': '미', '인': '신', '묘': '유',
  '진': '술', '사': '해', '오': '자', '미': '축',
  '신': '인', '유': '묘', '술': '진', '해': '사',
};

// 십이지형 (형벌 관계)
const HYEONG_RELATIONS: { [key: string]: string[] } = {
  '자': ['묘'],
  '축': ['진', '술', '미'],
  '인': ['사', '신'],
  '묘': ['자'],
  '진': ['축', '술', '미'],
  '사': ['인', '신'],
  '오': ['오'],
  '미': ['축', '진', '술'],
  '신': ['인', '사'],
  '유': ['유'],
  '술': ['축', '진', '미'],
  '해': ['해'],
};

// 십이지파 (파괴 관계)
const PA_RELATIONS: { [key: string]: string } = {
  '자': '유', '축': '신', '인': '해', '묘': '오',
  '진': '묘', '사': '자', '오': '묘', '미': '축',
  '신': '축', '유': '자', '술': '진', '해': '인',
};

// 십이지해 (해로움 관계)
const HAE_RELATIONS: { [key: string]: string } = {
  '자': '해', '축': '신', '인': '사', '묘': '진',
  '진': '묘', '사': '인', '오': '자', '미': '축',
  '신': '축', '유': '오', '술': '해', '해': '자',
};

/**
 * 사주 타입 정의
 * - 년주, 월주, 일주, 시주로 구성
 * - 각 주는 천간(gan)과 지지(ji)로 구성
 */
export interface Saju {
  year: { gan: string; ji: string };   // 년주 (생년)
  month: { gan: string; ji: string };  // 월주 (생월)
  day: { gan: string; ji: string };    // 일주 (생일)
  hour: { gan: string; ji: string };  // 시주 (생시)
}

/**
 * 살 분석 결과 타입
 */
export interface SalAnalysis {
  type: string;        // 살의 종류 (예: '충살', '형살')
  count: number;       // 살의 개수 (감점 요소)
  description: string; // 살에 대한 설명
}

/**
 * 양력 년도를 간지 년도로 변환
 */
function getGanjiYear(year: number): { gan: string; ji: string } {
  // 1984년이 갑자년 (기준)
  const baseYear = 1984;
  const offset = (year - baseYear) % 60;
  const ganIndex = offset % 10;
  const jiIndex = offset % 12;
  return { gan: GAN[ganIndex], ji: JI[jiIndex] };
}

/**
 * 월의 지지 계산 (절기 기준 간략화)
 */
function getGanjiMonth(year: number, month: number): { gan: string; ji: string } {
  const monthJi = ['인', '묘', '진', '사', '오', '미', '신', '유', '술', '해', '자', '축'];
  const ji = monthJi[month - 1];
  
  // 년간에 따른 월간 계산
  const yearGan = getGanjiYear(year).gan;
  const yearGanIndex = GAN.indexOf(yearGan);
  
  // 월간 계산 공식
  const monthGanIndex = (yearGanIndex * 2 + month) % 10;
  const gan = GAN[monthGanIndex];
  
  return { gan, ji };
}

/**
 * 일주 계산 (간략화된 알고리즘)
 */
function getGanjiDay(year: number, month: number, day: number): { gan: string; ji: string } {
  // 1900년 1월 1일을 기준으로 계산
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const ganIndex = diffDays % 10;
  const jiIndex = diffDays % 12;
  
  return { gan: GAN[ganIndex], ji: JI[jiIndex] };
}

/**
 * 시주 계산 (일간에 따라 시간 결정)
 * - 일간(일주 천간)에 따라 시간이 결정됨
 * - 시간에 따라 시지 결정
 */
function getGanjiHour(dayGan: string, hour: number): { gan: string; ji: string } {
  const hourJi = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const hourIndex = Math.floor((hour + 1) / 2) % 12;
  const ji = hourJi[hourIndex];
  
  // 일간에 따른 시간 계산
  const dayGanIndex = GAN.indexOf(dayGan);
  const hourGanIndex = (dayGanIndex * 2 + hourIndex) % 10;
  const gan = GAN[hourGanIndex];
  
  return { gan, ji };
}

/**
 * 생년월일시로 사주 계산
 * - 양력 날짜를 간지(干支)로 변환
 * - 년주, 월주, 일주, 시주 계산
 * @param year 년도 (1900-2100)
 * @param month 월 (1-12)
 * @param day 일 (1-31)
 * @param hour 시 (0-23, 기본값: 12)
 * @returns 계산된 사주 (년주, 월주, 일주, 시주)
 */
export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hour: number = 12
): Saju {
  const yearGanji = getGanjiYear(year);
  const monthGanji = getGanjiMonth(year, month);
  const dayGanji = getGanjiDay(year, month, day);
  const hourGanji = getGanjiHour(dayGanji.gan, hour);
  
  return {
    year: yearGanji,
    month: monthGanji,
    day: dayGanji,
    hour: hourGanji,
  };
}

/**
 * 사주에서 모든 지지 추출
 * - 년지, 월지, 일지, 시지를 배열로 반환
 * - 살 분석에 사용
 */
function getAllJi(saju: Saju): string[] {
  return [saju.year.ji, saju.month.ji, saju.day.ji, saju.hour.ji];
}

/**
 * 살(煞) 분석 - 충돌, 형, 파, 해 계산
 * - 두 사람의 사주를 비교하여 감점 요소인 '살' 계산
 * - 충살: 서로 반대되는 지지 관계
 * - 형살: 형벌 관계
 * - 파살: 파괴 관계
 * - 해살: 해로움 관계
 */
function analyzeSal(saju1: Saju, saju2: Saju): SalAnalysis[] {
  const ji1 = getAllJi(saju1);
  const ji2 = getAllJi(saju2);
  const results: SalAnalysis[] = [];
  
  // 충살 (충돌)
  let chungCount = 0;
  for (const ji of ji1) {
    if (ji2.includes(CHUNG_RELATIONS[ji])) {
      chungCount++;
    }
  }
  if (chungCount > 0) {
    results.push({
      type: '충살',
      count: chungCount,
      description: '충살은 서로 반대되는 성향으로 인한 갈등을 의미합니다.',
    });
  }
  
  // 형살 (형벌)
  let hyeongCount = 0;
  for (const ji of ji1) {
    const hyeongTargets = HYEONG_RELATIONS[ji] || [];
    for (const target of hyeongTargets) {
      if (ji2.includes(target)) {
        hyeongCount++;
      }
    }
  }
  if (hyeongCount > 0) {
    results.push({
      type: '형살',
      count: hyeongCount,
      description: '형살은 상호간의 충돌과 다툼을 나타냅니다.',
    });
  }
  
  // 파살 (파괴)
  let paCount = 0;
  for (const ji of ji1) {
    if (ji2.includes(PA_RELATIONS[ji])) {
      paCount++;
    }
  }
  if (paCount > 0) {
    results.push({
      type: '파살',
      count: paCount,
      description: '파살은 관계의 불안정성을 나타냅니다.',
    });
  }
  
  // 해살 (해로움)
  let haeCount = 0;
  for (const ji of ji1) {
    if (ji2.includes(HAE_RELATIONS[ji])) {
      haeCount++;
    }
  }
  if (haeCount > 0) {
    results.push({
      type: '해살',
      count: haeCount,
      description: '해살은 서로 해를 끼치는 요소입니다.',
    });
  }
  
  return results;
}

/**
 * 오행 분석
 * - 두 사람의 사주에서 오행(목, 화, 토, 금, 수) 추출
 * - 상생 관계와 상극 관계 계산
 * - 상생: 점수 가점, 상극: 점수 감점
 */
function analyzeElement(saju1: Saju, saju2: Saju): {
  compatible: number;   // 상생 관계 개수
  incompatible: number; // 상극 관계 개수
} {
  const elements1: string[] = [];
  const elements2: string[] = [];
  
  // 사주1의 오행 추출
  Object.values(saju1).forEach(({ gan, ji }) => {
    elements1.push(ELEMENT_MAP[gan] || '');
    elements1.push(ELEMENT_MAP[ji] || '');
  });
  
  // 사주2의 오행 추출
  Object.values(saju2).forEach(({ gan, ji }) => {
    elements2.push(ELEMENT_MAP[gan] || '');
    elements2.push(ELEMENT_MAP[ji] || '');
  });
  
  let compatible = 0;
  let incompatible = 0;
  
  // 상생 관계 계산
  for (const elem1 of elements1) {
    if (!elem1) continue;
    for (const elem2 of elements2) {
      if (!elem2) continue;
      if (ELEMENT_RELATIONS.상생[elem1 as keyof typeof ELEMENT_RELATIONS.상생] === elem2 ||
          ELEMENT_RELATIONS.상생[elem2 as keyof typeof ELEMENT_RELATIONS.상생] === elem1) {
        compatible++;
      }
      if (ELEMENT_RELATIONS.상극[elem1 as keyof typeof ELEMENT_RELATIONS.상극] === elem2 ||
          ELEMENT_RELATIONS.상극[elem2 as keyof typeof ELEMENT_RELATIONS.상극] === elem1) {
        incompatible++;
      }
    }
  }
  
  return { compatible, incompatible };
}

/**
 * 이름의 획수 계산 (간단한 버전)
 */
function calculateNameStrokes(name: string): number {
  if (!name || name.trim().length === 0) return 0;
  
  // 한글 이름의 간단한 획수 계산 (실제로는 더 복잡하지만 간략화)
  // 각 글자의 획수 대략값
  const strokeMap: { [key: string]: number } = {
    '가': 3, '나': 2, '다': 3, '라': 4, '마': 3, '바': 4, '사': 4, '아': 3,
    '자': 5, '차': 4, '카': 3, '타': 4, '파': 4, '하': 3,
  };
  
  let totalStrokes = 0;
  for (const char of name) {
    // 한글인 경우 대략적인 획수 계산
    if (char >= '가' && char <= '힣') {
      const code = char.charCodeAt(0) - '가'.charCodeAt(0);
      // 간단한 획수 추정 (실제로는 더 정확한 계산 필요)
      totalStrokes += 5 + (code % 10); // 5-15 획 사이
    } else {
      totalStrokes += 3; // 영문/숫자 등은 3획으로 가정
    }
  }
  
  return totalStrokes;
}

/**
 * 이름의 음양오행 계산
 */
function getNameElement(name: string): string {
  if (!name || name.trim().length === 0) return '토';
  
  const strokes = calculateNameStrokes(name);
  // 획수에 따른 오행 매핑
  const element = strokes % 5;
  const elements = ['목', '화', '토', '금', '수'];
  return elements[element];
}

/**
 * 성별 조합 점수 계산
 */
function calculateGenderCompatibility(gender1: string, gender2: string): number {
  if (!gender1 || !gender2) return 0;
  
  const g1 = gender1.trim();
  const g2 = gender2.trim();
  
  // 이성 조합은 긍정적
  if ((g1 === '남' && g2 === '여') || (g1 === '여' && g2 === '남')) {
    return 5; // 이성 조합 가점
  }
  
  // 동성 조합은 중립
  return 0;
}

/**
 * 일간과 성별의 음양 조화 계산
 */
function calculateYinYangHarmony(saju: Saju, gender: string): number {
  if (!gender) return 0;
  
  const dayGan = saju.day.gan;
  // 양간: 갑, 병, 무, 경, 임
  // 음간: 을, 정, 기, 신, 계
  const yangGan = ['갑', '병', '무', '경', '임'];
  const isYang = yangGan.includes(dayGan);
  
  // 남자는 양간, 여자는 음간을 선호하는 경향
  if ((gender === '남' && isYang) || (gender === '여' && !isYang)) {
    return 3; // 음양 조화 가점
  }
  
  return 0;
}

/**
 * 궁합 점수 계산 (메인 함수)
 * - 두 사람의 생년월일시, 이름, 성별을 기반으로 궁합 점수 계산
 * - 기본 점수 100점에서 살, 오행 상극, 이름 불일치 등으로 감점
 * - 오행 상생, 성별 조합, 음양 조화 등으로 가점
 * - 최종 점수는 0-100점 사이
 * 
 * @param birthDate1 첫 번째 사람의 생년월일 (YYYY-MM-DD)
 * @param birthTime1 첫 번째 사람의 생시 (HH:MM)
 * @param birthDate2 두 번째 사람의 생년월일 (YYYY-MM-DD)
 * @param birthTime2 두 번째 사람의 생시 (HH:MM)
 * @param name1 첫 번째 사람의 이름 (한글)
 * @param name2 두 번째 사람의 이름 (한글)
 * @param gender1 첫 번째 사람의 성별 ('남' 또는 '여')
 * @param gender2 두 번째 사람의 성별 ('남' 또는 '여')
 * @returns 궁합 점수, 사주 정보, 살 분석 결과, 설명
 */
export function calculateCompatibility(
  birthDate1: string,
  birthTime1: string,
  birthDate2: string,
  birthTime2: string,
  name1: string = '',
  name2: string = '',
  gender1: string = '',
  gender2: string = ''
): {
  score: number;              // 궁합 점수 (0-100)
  saju1: Saju;                // 첫 번째 사람의 사주
  saju2: Saju;                // 두 번째 사람의 사주
  salAnalysis: SalAnalysis[]; // 살 분석 결과
  explanation: string;         // 점수에 대한 설명
} {
  // 생년월일 파싱 및 검증
  if (!birthDate1 || !birthDate2) {
    throw new Error('생년월일은 필수입니다.');
  }
  
  const date1Parts = birthDate1.split('-');
  const date2Parts = birthDate2.split('-');
  
  if (date1Parts.length !== 3 || date2Parts.length !== 3) {
    throw new Error('생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD 형식 필요)');
  }
  
  const [y1, m1, d1] = date1Parts.map(Number);
  const [y2, m2, d2] = date2Parts.map(Number);
  
  // 날짜 유효성 검증
  if (isNaN(y1) || isNaN(m1) || isNaN(d1) || isNaN(y2) || isNaN(m2) || isNaN(d2)) {
    throw new Error('생년월일이 올바르지 않습니다.');
  }
  
  if (y1 < 1900 || y1 > 2100 || y2 < 1900 || y2 > 2100) {
    throw new Error('생년은 1900년부터 2100년까지 입력 가능합니다.');
  }
  
  if (m1 < 1 || m1 > 12 || m2 < 1 || m2 > 12) {
    throw new Error('월은 1월부터 12월까지 입력 가능합니다.');
  }
  
  if (d1 < 1 || d1 > 31 || d2 < 1 || d2 > 31) {
    throw new Error('일은 1일부터 31일까지 입력 가능합니다.');
  }
  
  // 생시 파싱 (선택적)
  let h1 = 12, h2 = 12;
  if (birthTime1) {
    const time1Parts = birthTime1.split(':');
    if (time1Parts.length >= 1) {
      const hour1 = Number(time1Parts[0]);
      if (!isNaN(hour1) && hour1 >= 0 && hour1 <= 23) {
        h1 = hour1;
      }
    }
  }
  if (birthTime2) {
    const time2Parts = birthTime2.split(':');
    if (time2Parts.length >= 1) {
      const hour2 = Number(time2Parts[0]);
      if (!isNaN(hour2) && hour2 >= 0 && hour2 <= 23) {
        h2 = hour2;
      }
    }
  }
  
  // 1. 사주 계산: 양력 날짜를 간지로 변환
  const saju1 = calculateSaju(y1, m1, d1, h1);
  const saju2 = calculateSaju(y2, m2, d2, h2);
  
  // 2. 살 분석: 두 사주 비교하여 감점 요소 계산
  const salAnalysis = analyzeSal(saju1, saju2);
  
  // 3. 오행 분석: 상생/상극 관계 계산
  const elementAnalysis = analyzeElement(saju1, saju2);
  
  // 4. 기본 점수: 100점에서 시작
  let score = 100;
  
  // 5. 살에 따른 감점: 각 살당 10점 감점
  salAnalysis.forEach((sal) => {
    score -= sal.count * 10;
  });
  
  // 6. 오행 상극에 따른 감점: 상극 관계당 2점 감점
  score -= elementAnalysis.incompatible * 2;
  
  // 7. 오행 상생에 따른 가점: 상생 관계당 1점 가점 (최대 10점)
  score += Math.min(elementAnalysis.compatible * 1, 10);
  
  // 8. 성별 조합 점수: 이성 조합이면 5점 가점
  const genderScore = calculateGenderCompatibility(gender1, gender2);
  score += genderScore;
  
  // 9. 음양 조화 점수: 일간과 성별의 음양 조화
  const yinYangScore1 = calculateYinYangHarmony(saju1, gender1);
  const yinYangScore2 = calculateYinYangHarmony(saju2, gender2);
  score += yinYangScore1 + yinYangScore2;
  
  // 10. 이름 오행 조화: 이름의 오행이 상생/상극 관계인지 확인
  if (name1 && name2) {
    const nameElement1 = getNameElement(name1);
    const nameElement2 = getNameElement(name2);
    
    // 이름 오행이 상생 관계면 가점 (3점)
    if (ELEMENT_RELATIONS.상생[nameElement1 as keyof typeof ELEMENT_RELATIONS.상생] === nameElement2 ||
        ELEMENT_RELATIONS.상생[nameElement2 as keyof typeof ELEMENT_RELATIONS.상생] === nameElement1) {
      score += 3;
    }
    
    // 이름 오행이 상극 관계면 감점 (2점)
    if (ELEMENT_RELATIONS.상극[nameElement1 as keyof typeof ELEMENT_RELATIONS.상극] === nameElement2 ||
        ELEMENT_RELATIONS.상극[nameElement2 as keyof typeof ELEMENT_RELATIONS.상극] === nameElement1) {
      score -= 2;
    }
    
    // 이름 획수 차이가 적으면 가점 (2점): 획수 차이가 5 이하일 때
    const strokes1 = calculateNameStrokes(name1);
    const strokes2 = calculateNameStrokes(name2);
    const strokeDiff = Math.abs(strokes1 - strokes2);
    if (strokeDiff <= 5) {
      score += 2;
    }
  }
  
  // 11. 점수 범위 조정: 0-100점 사이로 제한
  score = Math.max(0, Math.min(100, score));
  
  // 12. 점수에 따른 설명 생성
  let explanation = '';
  if (score >= 80) {
    explanation = '매우 좋은 궁합입니다. 서로 잘 어울리며 행복한 관계를 이어갈 수 있습니다.';
  } else if (score >= 60) {
    explanation = '무난한 궁합입니다. 서로 노력하면 좋은 관계를 유지할 수 있습니다.';
  } else if (score >= 40) {
    explanation = '보통의 궁합입니다. 서로 이해하고 양보하면 관계를 발전시킬 수 있습니다.';
  } else {
    explanation = '주의가 필요한 궁합입니다. 서로의 차이를 인정하고 소통이 중요합니다.';
  }
  
  return {
    score,
    saju1,
    saju2,
    salAnalysis,
    explanation,
  };
}

