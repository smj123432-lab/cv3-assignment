const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// "2026-07-17T14:00:00" -> "26.07.17 (금) 14:00"
export function formatDateTime(isoString: string): string {
  const d = new Date(isoString)

  const yy = String(d.getFullYear()).slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const weekday = WEEKDAYS[d.getDay()]
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')

  return `${yy}.${mm}.${dd} (${weekday}) ${hh}:${min}`
}
