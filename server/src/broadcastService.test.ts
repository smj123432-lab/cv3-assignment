import { describe, it, expect } from 'vitest'
import { parseLbDatetime, parseHsDatetime } from './broadcastService'

describe('parseLbDatetime (YYMMDDHHMM → ISO)', () => {
  it('2607171400 → 2026-07-17T14:00:00', () => {
    expect(parseLbDatetime('2607171400')).toBe('2026-07-17T14:00:00')
  })

  it('2601010900 → 2026-01-01T09:00:00', () => {
    expect(parseLbDatetime('2601010900')).toBe('2026-01-01T09:00:00')
  })

  it('2512312359 → 2025-12-31T23:59:00', () => {
    expect(parseLbDatetime('2512312359')).toBe('2025-12-31T23:59:00')
  })
})

describe('parseHsDatetime (YYYYMMDDHHMM → ISO)', () => {
  it('202607171400 → 2026-07-17T14:00:00', () => {
    expect(parseHsDatetime('202607171400')).toBe('2026-07-17T14:00:00')
  })

  it('202601010900 → 2026-01-01T09:00:00', () => {
    expect(parseHsDatetime('202601010900')).toBe('2026-01-01T09:00:00')
  })

  it('202512312359 → 2025-12-31T23:59:00', () => {
    expect(parseHsDatetime('202512312359')).toBe('2025-12-31T23:59:00')
  })
})
