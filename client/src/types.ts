// 서버 /api/broadcasts 응답 타입 (로그인 여부에 따라 잠긴 필드는 서버가 null 반환)
export interface Broadcast {
  rank: number
  title: string
  channel: string
  category: string
  broadcastTime: string
  productCount: number
  metricLabel: string        // '조회수' (lb) | '시청률' (hs)
  metricValue: number | null
  sales: number | null
  revenue: number | null
}
