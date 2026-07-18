import { describe, it, expect } from 'vitest'
import { formatDateTime } from './formatDateTime'

describe('formatDateTime', () => {
  it('금요일 — 2026-07-17 14:00', () => {
    expect(formatDateTime('2026-07-17T14:00:00')).toBe('26.07.17 (금) 14:00')
  })

  it('토요일 — 2026-07-18 09:30', () => {
    expect(formatDateTime('2026-07-18T09:30:00')).toBe('26.07.18 (토) 09:30')
  })

  it('목요일 — 2026-01-01 00:00 (월/일 한 자리 → 0 패딩)', () => {
    expect(formatDateTime('2026-01-01T00:00:00')).toBe('26.01.01 (목) 00:00')
  })

  it('일요일 — 2026-03-08 20:00', () => {
    expect(formatDateTime('2026-03-08T20:00:00')).toBe('26.03.08 (일) 20:00')
  })
})
