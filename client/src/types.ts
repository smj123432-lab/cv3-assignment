// 백엔드 API에서 비로그인으로 가져오는 필드
export interface UnlockedFields {
  rank: number
  title: string
  channel: string
  category: string
  broadcastTime: string
  productCount: number
}

// 로그인 후에만 보이는 값의 스냅샷 (2026-07-17 기준)
export interface LockedSnapshot {
  metricLabel: string // '조회수' | '시청률'
  metricValue: number | null
  sales: number | null
  revenue: string | null
}

// 화면에 렌더링하는 최종 타입
export type Broadcast = UnlockedFields & LockedSnapshot
