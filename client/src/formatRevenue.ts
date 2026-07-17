// 사이트 표기 규칙 (실제 관찰값 기준):
// - 조: 소수 2자리, 후행 0 제거
// - 억: 소수 2자리, 후행 0 제거 (예: "2.12억", "1.19억")
// - 만: 소수 1자리, 후행 .0이면 정수로, 천단위 콤마 (예: "644만", "97.7만", "1,357만", "3,107.5만")
// - 만 미만: 콤마 숫자

function fmtOk(n: number): string {
  return n.toFixed(2).replace(/\.?0+$/, '')
}

function fmtMan(n: number): string {
  // 소수 1자리 반올림 후, 정수부에 천단위 콤마 적용
  const str = n.toFixed(1)               // "3107.5" or "644.0"
  const [intStr, decStr] = str.split('.')
  const intFormatted = parseInt(intStr, 10).toLocaleString('ko-KR')  // "3,107" or "644"
  return decStr === '0' ? intFormatted : `${intFormatted}.${decStr}` // "3,107.5" or "644"
}

export function formatRevenue(amountInWon: number | null): string {
  if (amountInWon === null) return ''
  const a = Math.abs(amountInWon)
  const sign = amountInWon < 0 ? '-' : ''
  if (a >= 1e12) return `${sign}${fmtOk(a / 1e12)}조`
  if (a >= 1e8)  return `${sign}${fmtOk(a / 1e8)}억`
  if (a >= 1e4)  return `${sign}${fmtMan(a / 1e4)}만`
  return amountInWon.toLocaleString('ko-KR')
}
