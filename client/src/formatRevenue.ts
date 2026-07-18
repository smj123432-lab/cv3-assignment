// 사이트 표기 규칙 (실제 관찰값 기준, 40개 이상 표본 확인):
// - 조: 소수 2자리, 후행 0 제거
// - 억: 소수 2자리, 후행 0 제거 (예: "2.12억", "1.19억")
// - 만: 소수점 없는 정수, 천단위 콤마 (예: "682만", "1,293만")
// - 만 미만: 콤마 숫자

function fmtOk(n: number): string {
  return n.toFixed(2).replace(/\.?0+$/, '')
}

function fmtMan(amountInWon: number): string {
  return Math.round(amountInWon / 1e4).toLocaleString('ko-KR')
}

export function formatRevenue(amountInWon: number | null): string {
  if (amountInWon === null) return ''
  const a = Math.abs(amountInWon)
  const sign = amountInWon < 0 ? '-' : ''
  if (a >= 1e12) return `${sign}${fmtOk(a / 1e12)}조`
  if (a >= 1e8)  return `${sign}${fmtOk(a / 1e8)}억`
  if (a >= 1e4)  return `${sign}${fmtMan(a)}만`
  return amountInWon.toLocaleString('ko-KR')
}
