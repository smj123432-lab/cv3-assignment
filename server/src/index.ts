import express from 'express'
import cors from 'cors'
import { fetchBroadcasts } from './broadcastService'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.get('/api/broadcasts', async (req, res) => {
  const type = req.query.type as string
  if (type !== 'lb' && type !== 'hs') {
    res.status(400).json({ error: 'type은 lb 또는 hs 이어야 합니다' })
    return
  }

  try {
    const data = await fetchBroadcasts(type)
    res.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류'
    res.status(500).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`)
})
