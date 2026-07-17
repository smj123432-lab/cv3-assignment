export interface Broadcast {
  rank: number
  title: string
  channel: string
  category: string
  broadcastTime: string
  productCount: number
  metricLabel: string        // '조회수' (lb) | '시청률' (hs)
  metricValue: number | null // visit_cnt — 로그인 시 실제 값, 비로그인 시 null
  sales: number | null       // sales_cnt — 로그인 시 실제 값, 비로그인 시 null
  revenue: number | null     // sales_amt — 로그인 시 실제 값, 비로그인 시 null
}
