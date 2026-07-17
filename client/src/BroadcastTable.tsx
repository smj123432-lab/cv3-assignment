import { formatDateTime } from './formatDateTime'
import { formatRevenue } from './formatRevenue'
import type { Broadcast } from './types'

// 잠긴 값(null)은 자물쇠 표시, 숫자는 콤마 포맷, 문자열은 그대로 출력
function LockedOrValue({ value }: { value: number | string | null }) {
  if (value === null || value === undefined) {
    return <span className="locked">🔒 로그인</span>
  }
  if (typeof value === 'number') {
    return <span>{value.toLocaleString()}</span>
  }
  return <span>{value}</span>
}

interface Props {
  items: Broadcast[]
}

export default function BroadcastTable({ items }: Props) {
  return (
    <table className="broadcast-table">
      <thead>
        <tr>
          <th>순위</th>
          <th>방송정보</th>
          <th>분류</th>
          <th>방송시간</th>
          {/* 라방/홈쇼핑에 따라 조회수 or 시청률로 라벨이 바뀜 */}
          <th>{items[0]?.metricLabel ?? '조회수'}</th>
          <th>판매량</th>
          <th>매출액</th>
          <th>상품수</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.rank}>
            <td className="rank">{item.rank}</td>
            <td className="title-cell">
              <div className="title">{item.title}</div>
              <div className="channel">{item.channel}</div>
            </td>
            <td>{item.category}</td>
            <td>{formatDateTime(item.broadcastTime)}</td>
            <td>
              <LockedOrValue value={item.metricValue} />
            </td>
            <td>
              <LockedOrValue value={item.sales} />
            </td>
            <td>
              <LockedOrValue value={
                item.revenue === null ? null
                : typeof item.revenue === 'number' ? formatRevenue(item.revenue)
                : item.revenue
              } />
            </td>
            <td>{item.productCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
