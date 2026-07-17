import { useState, useEffect } from 'react'
import BroadcastTable from './BroadcastTable'
import type { Broadcast } from './types'

type TabType = 'live' | 'homeshopping'

export default function App() {
  const [tab, setTab] = useState<TabType>('live')
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchBroadcasts = () => {
    const apiType = tab === 'live' ? 'lb' : 'hs'
    setLoading(true)
    fetch(`http://localhost:4000/api/broadcasts?type=${apiType}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data: Broadcast[]) => setBroadcasts(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBroadcasts()
  }, [tab])

  return (
    <div className="page">
      <div className="page-header">
        <h1>라방 · 홈쇼핑 랭킹 (채용 과제)</h1>
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
