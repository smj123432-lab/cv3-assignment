import { useState } from 'react'
import BroadcastTable from './BroadcastTable'
import { liveBroadcasts, homeShoppingBroadcasts } from './data'

export default function App() {
  // 'live' | 'homeshopping'
  const [type, setType] = useState('live')

  const items = type === 'live' ? liveBroadcasts : homeShoppingBroadcasts

  return (
    <div className="page">
      <h1>라방 · 홈쇼핑 랭킹 (채용 과제)</h1>

      <div className="toggle">
        <button
          className={type === 'live' ? 'active' : ''}
          onClick={() => setType('live')}
        >
          라방
        </button>
        <button
          className={type === 'homeshopping' ? 'active' : ''}
          onClick={() => setType('homeshopping')}
        >
          홈쇼핑
        </button>
      </div>

      <BroadcastTable items={items} />
    </div>
  )
}
