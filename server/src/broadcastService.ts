import type { UnlockedBroadcast } from './types'

const API_URL = 'https://live.ecomm-data.com/api/assignment/list'

// lb의 platform_id는 코드값("naver", "cjonstyle" 등)이라 표시명으로 변환
const PLATFORM_NAMES: Record<string, string> = {
  naver: '네이버쇼핑LIVE',
  cjonstyle: 'CJ온스타일',
  gsshop: 'GS샵',
  hmall: '현대H몰',
  grip: '그립',
  ssg_live: 'SSG라이브',
  kakao: '카카오쇼핑LIVE',
  lotte: '롯데ON',
}

// lb의 cid는 숫자 서브카테고리 코드. hs API의 cat.cat_name에서 확인한 값 + 추가 매핑
// 매핑에 없는 cid는 "기타"로 표시
const CID_NAMES: Record<number, string> = {
  50000026: '식품',
  50000066: '생활/건강',
  50000109: '패션의류',
  50000138: '생활/건강',
  50000145: '식품',
  50000153: '화장품/미용',
  50000160: '패션의류',
  50000167: '패션의류',
  50000205: '디지털/가전',
  50000208: '디지털/가전',
  50000210: '디지털/가전',
  50000212: '디지털/가전',
  50000213: '디지털/가전',
}

// lb datetime 형식: "YYMMDDHHMM" (10자) → ISO 문자열
function parseLbDatetime(s: string): string {
  const yy = s.slice(0, 2)
  const mm = s.slice(2, 4)
  const dd = s.slice(4, 6)
  const hh = s.slice(6, 8)
  const min = s.slice(8, 10)
  return `20${yy}-${mm}-${dd}T${hh}:${min}:00`
}

// hs datetime 형식: "YYYYMMDDHHMM" (12자) → ISO 문자열
function parseHsDatetime(s: string): string {
  const yyyy = s.slice(0, 4)
  const mm = s.slice(4, 6)
  const dd = s.slice(6, 8)
  const hh = s.slice(8, 10)
  const min = s.slice(10, 12)
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`
}

// API 응답 원본 타입
interface LbItem {
  objectID: string
  platform_id: string
  datetime_start: string
  product_cnt: number
  visit_cnt: number | null
  sales_cnt: number | null
  sales_amt: number | null
  title: string
  cid: number
}

interface HsItem {
  hsshow_id: string
  platform_name: string
  hsshow_title: string
  hsshow_datetime_start: string
  item_cnt: number
  sales_cnt: number | null
  sales_amt: number | null
  cat: { cid: number; cat_name: string }
}

interface ApiResponse {
  list: LbItem[] | HsItem[]
}

export async function fetchBroadcasts(type: 'lb' | 'hs'): Promise<UnlockedBroadcast[]> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  })

  if (!res.ok) {
    throw new Error(`외부 API 오류: ${res.status}`)
  }

  const data = (await res.json()) as ApiResponse
  const list = data.list ?? []

  if (type === 'lb') {
    return (list as LbItem[]).slice(0, 10).map((item, i) => ({
      rank: i + 1,
      title: item.title,
      channel: PLATFORM_NAMES[item.platform_id] ?? item.platform_id,
      category: CID_NAMES[item.cid] ?? '기타',
      broadcastTime: parseLbDatetime(item.datetime_start),
      productCount: item.product_cnt,
    }))
  } else {
    return (list as HsItem[]).slice(0, 10).map((item, i) => ({
      rank: i + 1,
      title: item.hsshow_title,
      channel: item.platform_name,
      category: item.cat?.cat_name ?? '',
      broadcastTime: parseHsDatetime(item.hsshow_datetime_start),
      productCount: item.item_cnt,
    }))
  }
}
