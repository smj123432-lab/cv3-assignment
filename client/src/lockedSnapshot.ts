import type { LockedSnapshot } from './types'

// 로그인 시 노출되는 값의 스냅샷 (2026-07-17 기준)
// 실시간 API는 조회수/판매량/매출액을 비로그인 상태에서 null로 내려줌.
// 계정 자격증명을 코드에 넣지 않기 위해, 로그인 후 수동 확인한 값을 여기에 하드코딩.
// rank를 키로 사용 → App.tsx에서 API 응답과 rank 기준으로 merge.

export const lbSnapshot: Record<number, LockedSnapshot> = {
  1:  { metricLabel: '조회수', metricValue: 1174, sales: 8,   revenue: '352만'  },
  2:  { metricLabel: '조회수', metricValue: 232,  sales: 1,   revenue: '345만'  },
  3:  { metricLabel: '조회수', metricValue: 353,  sales: 1,   revenue: '330만'  },
  4:  { metricLabel: '조회수', metricValue: 271,  sales: 3,   revenue: '298만'  },
  5:  { metricLabel: '조회수', metricValue: 2710, sales: 159, revenue: '239만'  },
  6:  { metricLabel: '조회수', metricValue: 350,  sales: 10,  revenue: '202만'  },
  7:  { metricLabel: '조회수', metricValue: 140,  sales: 2,   revenue: '175만'  },
  8:  { metricLabel: '조회수', metricValue: 606,  sales: 89,  revenue: '155만'  },
  9:  { metricLabel: '조회수', metricValue: 316,  sales: 6,   revenue: '102만'  },
  10: { metricLabel: '조회수', metricValue: 48,   sales: 3,   revenue: '97.7만' },
}

// 홈쇼핑 시청률은 API 자체에 필드가 없어 null 처리 (프론트에서 잠금 표시)
export const hsSnapshot: Record<number, LockedSnapshot> = {
  1:  { metricLabel: '시청률', metricValue: null, sales: 110,  revenue: '2.12억' },
  2:  { metricLabel: '시청률', metricValue: null, sales: 226,  revenue: '1.42억' },
  3:  { metricLabel: '시청률', metricValue: null, sales: 1967, revenue: '1.37억' },
  4:  { metricLabel: '시청률', metricValue: null, sales: 564,  revenue: '1.23억' },
  5:  { metricLabel: '시청률', metricValue: null, sales: 1736, revenue: '1.19억' },
  6:  { metricLabel: '시청률', metricValue: null, sales: 1967, revenue: '9812만' },
  7:  { metricLabel: '시청률', metricValue: null, sales: 293,  revenue: '8081만' },
  8:  { metricLabel: '시청률', metricValue: null, sales: 714,  revenue: '7847만' },
  9:  { metricLabel: '시청률', metricValue: null, sales: 2219, revenue: '6055만' },
  10: { metricLabel: '시청률', metricValue: null, sales: 724,  revenue: '4561만' },
}
