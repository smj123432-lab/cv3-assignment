// 실제 사이트 표기를 40개 이상 샘플로 확인해서 맞춘 규칙입니다.
// 조/억은 소수 2자리에 후행 0 제거 (예: "4.8억", "1.03억"),
// 만 단위는 소수점 없는 정수 + 천단위 콤마 (예: "682만", "1,293만").

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
