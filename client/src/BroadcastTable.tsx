import { formatDateTime } from "./formatDateTime";
import { formatRevenue } from "./formatRevenue";
import type { Broadcast } from "./types";

// 잠긴 값(null)은 자물쇠 표시, 숫자는 콤마 포맷, 문자열은 그대로 출력
function LockedOrValue({ value }: { value: number | string | null }) {
  if (value === null || value === undefined) {
    return <span className="locked">🔒</span>;
  }
  if (typeof value === "number") {
    return <span>{value.toLocaleString()}</span>;
  }
  return <span>{value}</span>;
}

interface Column {
  key: string
  label: string | ((items: Broadcast[]) => string)
  width: number
  tdClassName?: string
  render: (item: Broadcast) => React.ReactNode
}

const COLUMNS: Column[] = [
  {
    key: "rank",
    label: "순위",
    width: 52,
    tdClassName: "rank",
    render: (item) => item.rank,
  },
  {
    key: "title",
    label: "방송정보",
    width: 300,
    tdClassName: "title-cell",
    render: (item) => (
      <>
        <div className="title">{item.title}</div>
        <div className="channel">{item.channel}</div>
      </>
    ),
  },
  {
    key: "category",
    label: "분류",
    width: 106,
    render: (item) => item.category,
  },
  {
    key: "broadcastTime",
    label: "방송시간",
    width: 140,
    render: (item) => formatDateTime(item.broadcastTime),
  },
  {
    key: "metricValue",
    label: (items) => items[0]?.metricLabel ?? "조회수",
    width: 88,
    render: (item) => <LockedOrValue value={item.metricValue} />,
  },
  {
    key: "sales",
    label: "판매량",
    width: 88,
    render: (item) => <LockedOrValue value={item.sales} />,
  },
  {
    key: "revenue",
    label: "매출액",
    width: 106,
    render: (item) => (
      <LockedOrValue
        value={item.revenue === null ? null : formatRevenue(item.revenue)}
      />
    ),
  },
  {
    key: "productCount",
    label: "상품수",
    width: 68,
    render: (item) => item.productCount,
  },
];

interface Props {
  items: Broadcast[];
}

export default function BroadcastTable({ items }: Props) {
  return (
    <table className="broadcast-table">
      <thead>
        <tr>
          {COLUMNS.map((col) => (
            <th key={col.key} style={{ width: col.width }}>
              {typeof col.label === "function" ? col.label(items) : col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.rank}>
            {COLUMNS.map((col) => (
              <td key={col.key} className={col.tdClassName}>
                {col.render(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
