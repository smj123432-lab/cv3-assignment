// TODO: 아래 더미 데이터를 과제 링크 페이지에서 직접 확인한 실데이터로 교체하세요.
// - rank: 순위 (1~10)
// - title: 방송 제목
// - channel: 채널명 (예: 네이버쇼핑LIVE, CJ온스타일 등)
// - category: 분류 (예: 디지털/가전, 패션의류 등)
// - broadcastTime: ISO 형식 문자열 (예: "2026-07-17T14:00:00")
// - metricLabel: 라방이면 "조회수", 홈쇼핑이면 "시청률"
// - metricValue: 로그인 후에만 보이는 값 → null로 두고 화면에는 🔒 표시
// - sales: 판매량 (🔒 → null)
// - revenue: 매출액 (🔒 → null)
// - productCount: 상품수

export const liveBroadcasts = [
  {
    rank: 1,
    title: '[AI라이브] 삼성 에어컨들 총집합! 오늘 (더미 예시)',
    channel: '네이버쇼핑LIVE',
    category: '디지털/가전',
    broadcastTime: '2026-07-17T14:00:00',
    metricLabel: '조회수',
    metricValue: null,
    sales: null,
    revenue: null,
    productCount: 40,
  },
  {
    rank: 2,
    title: '[AI] 에어케어 삼성이 선물하는 스마트 (더미 예시)',
    channel: '네이버쇼핑LIVE',
    category: '디지털/가전',
    broadcastTime: '2026-07-17T14:00:00',
    metricLabel: '조회수',
    metricValue: null,
    sales: null,
    revenue: null,
    productCount: 52,
  },
  // TODO: 3~10위까지 추가
]

export const homeShoppingBroadcasts = [
  {
    rank: 1,
    title: '홈쇼핑 더미 예시 제목 1',
    channel: 'CJ온스타일',
    category: '패션의류',
    broadcastTime: '2026-07-17T18:00:00',
    metricLabel: '시청률',
    metricValue: null,
    sales: null,
    revenue: null,
    productCount: 10,
  },
  // TODO: 2~10위까지 추가
]
