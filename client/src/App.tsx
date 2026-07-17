import { useState, useEffect, useRef } from 'react'
import BroadcastTable from './BroadcastTable'
import type { Broadcast } from './types'

type TabType = 'live' | 'homeshopping'

const API = 'http://localhost:4000'

export default function App() {
  const [tab, setTab] = useState<TabType>('live')
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<string>('')
  const [loginLoading, setLoginLoading] = useState<boolean>(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const fetchBroadcasts = () => {
    const apiType = tab === 'live' ? 'lb' : 'hs'
    setLoading(true)
    fetch(`${API}/api/broadcasts?type=${apiType}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data: Broadcast[]) => setBroadcasts(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBroadcasts()
  }, [tab])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = emailRef.current?.value ?? ''
    const password = passwordRef.current?.value ?? ''
    if (!email || !password) return

    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        // password 값은 절대 로그로 남기지 않음
        if (passwordRef.current) passwordRef.current.value = ''
        setIsLoggedIn(true)
        fetchBroadcasts()
      } else {
        setLoginError('로그인에 실패했습니다')
      }
    } catch {
      setLoginError('로그인에 실패했습니다')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch(`${API}/api/logout`, { method: 'POST', credentials: 'include' })
    setIsLoggedIn(false)
    fetchBroadcasts()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>라방 · 홈쇼핑 랭킹 (채용 과제)</h1>

        {isLoggedIn ? (
          <div className="login-area">
            <span className="login-status">로그인됨</span>
            <button className="login-btn active" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <form className="login-area" onSubmit={handleLogin}>
            <input
              ref={emailRef}
              type="email"
              placeholder="이메일"
              className="login-input"
              autoComplete="email"
            />
            <input
              ref={passwordRef}
              type="password"
              placeholder="비밀번호"
              className="login-input"
              autoComplete="current-password"
            />
            <button type="submit" className="login-btn" disabled={loginLoading}>
              {loginLoading ? '로그인 중…' : '로그인'}
            </button>
            {loginError && <span className="login-error">{loginError}</span>}
          </form>
        )}
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
