import express from 'express'
import cors from 'cors'
import { fetchBroadcasts } from './broadcastService'
import { loginToLabangba } from './authService'
import { createSession, getSession, deleteSession } from './session'

const app = express()
const PORT = 4000

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}))
app.use(express.json())

// cookie-parser 없이 쿠키 헤더에서 특정 값만 꺼냅니다
function parseCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined
  const entry = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${name}=`))
  return entry ? entry.slice(name.length + 1) : undefined
}

// email/password는 로그에 절대 남기지 않습니다
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'email과 password가 필요합니다' })
    return
  }

  try {
    const labangbaCookie = await loginToLabangba(email, password)
    const sessionId = createSession(labangbaCookie)

    res.cookie('our_session', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    })

    res.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : '로그인 실패'
    res.status(401).json({ error: message })
  }
})

app.post('/api/logout', (req, res) => {
  const sessionId = parseCookie(req.headers.cookie, 'our_session')
  if (sessionId) {
    deleteSession(sessionId)
  }
  res.clearCookie('our_session')
  res.json({ ok: true })
})

// 새로고침 시 프론트가 여기를 호출해서 로그인 상태를 복원합니다
app.get('/api/me', (req, res) => {
  const sessionId = parseCookie(req.headers.cookie, 'our_session')
  const loggedIn = sessionId ? getSession(sessionId) !== undefined : false
  res.json({ loggedIn })
})

app.get('/api/broadcasts', async (req, res) => {
  const type = req.query.type as string
  if (type !== 'lb' && type !== 'hs') {
    res.status(400).json({ error: 'type은 lb 또는 hs 이어야 합니다' })
    return
  }

  const sessionId = parseCookie(req.headers.cookie, 'our_session')
  const labangbaCookie = sessionId ? getSession(sessionId) : undefined

  try {
    const data = await fetchBroadcasts(type, labangbaCookie)
    res.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류'
    res.status(500).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`)
})
