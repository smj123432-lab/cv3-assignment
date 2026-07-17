// 사이트 원본 JS(0748l.q-hwune.js)의 sales_amount 포맷팅 로직 그대로 이식
// e.toFixed(2).replace(/\.?0+$/, "") → 소수 둘째자리, 후행 0 제거
// 1조 이상: "X.XX조", 1억 이상: "X.XX억", 1만 이상: "X.XX만", 미만: 콤마 숫자

function fmt(n: number): string {
  return n.toFixed(2).replace(/\.?0+$/, '')
}

export function formatRevenue(amountInWon: number | null): string {
  if (amountInWon === null) return ''
  const a = Math.abs(amountInWon)
  const sign = amountInWon < 0 ? '-' : ''
  if (a >= 1e12) return `${sign}${fmt(a / 1e12)}조`
  if (a >= 1e8)  return `${sign}${fmt(a / 1e8)}억`
  if (a >= 1e4)  return `${sign}${fmt(a / 1e4)}만`
  return amountInWon.toLocaleString('ko-KR')
}
