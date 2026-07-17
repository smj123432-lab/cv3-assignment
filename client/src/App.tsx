import { useState, useEffect } from 'react'
import BroadcastTable from './BroadcastTable'
import { lbSnapshot, hsSnapshot } from './lockedSnapshot'
import type { UnlockedFields, Broadcast } from './types'

type TabType = 'live' | 'homeshopping'

export default function App() {
  const [tab, setTab] = useState<TabType>('live')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [unlockedItems, setUnlockedItems] = useState<UnlockedFields[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const apiType = tab === 'live' ? 'lb' : 'hs'
    setLoading(true)
    fetch(`http://localhost:4000/api/broadcasts?type=${apiType}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data: UnlockedFields[]) => setUnlockedItems(data))
      .finally(() => setLoading(false))
  }, [tab])

  // API 결과(UnlockedFields)와 스냅샷(LockedSnapshot)을 rank 기준으로 합침
  const snapshot = tab === 'live' ? lbSnapshot : hsSnapshot
  const broadcasts: Broadcast[] = unlockedItems.map((item) => {
    const locked = snapshot[item.rank]
    return {
      ...item,
      metricLabel: locked?.metricLabel ?? '',
      // 로그아웃 상태면 잠긴 값을 null로 덮어써서 테이블에 🔒 표시
      metricValue: isLoggedIn ? (locked?.metricValue ?? null) : null,
      sales: isLoggedIn ? (locked?.sales ?? null) : null,
      revenue: isLoggedIn ? (locked?.revenue ?? null) : null,
    }
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1>라방 · 홈쇼핑 랭킹 (채용 과제)</h1>
        <button
          className={`login-btn${isLoggedIn ? ' active' : ''}`}
          onClick={() => setIsLoggedIn((prev) => !prev)}
        >
          {isLoggedIn ? '로그아웃' : '로그인'}
        </button>
      </div>

      <div className="toggle">
        <button
          className={tab === 'live' ? 'active' : ''}
          onClick={() => setTab('live')}
        >
          라방
        </button>
        <button
          className={tab === 'homeshopping' ? 'active' : ''}
          onClick={() => setTab('homeshopping')}
        >
          홈쇼핑
        </button>
      </div>

      {loading ? (
        <p className="loading">불러오는 중...</p>
      ) : (
        <BroadcastTable items={broadcasts} />
      )}
    </div>
  )
}
