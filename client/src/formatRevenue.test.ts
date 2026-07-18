import { describe, it, expect } from 'vitest'
import { formatRevenue } from './formatRevenue'

describe('formatRevenue', () => {
  describe('만 단위 — 정수 반올림 + 천단위 콤마', () => {
    it('12930000 → 1,293만', () => {
      expect(formatRevenue(12930000)).toBe('1,293만')
    })
    it('10465000 → 1,047만 (10465 → 반올림 1047)', () => {
      expect(formatRevenue(10465000)).toBe('1,047만')
    })
    it('66635000 → 6,664만 (6663.5 → 반올림 6664)', () => {
      expect(formatRevenue(66635000)).toBe('6,664만')
    })
  })

  describe('억 단위 — 소수 2자리, 후행 0 제거', () => {
    it('479845000 → 4.8억', () => {
      expect(formatRevenue(479845000)).toBe('4.8억')
    })
    it('102856000 → 1.03억', () => {
      expect(formatRevenue(102856000)).toBe('1.03억')
    })
  })

  describe('특수 케이스', () => {
    it('null → 빈 문자열', () => {
      expect(formatRevenue(null)).toBe('')
    })
    it('음수 → 부호 포함 변환', () => {
      expect(formatRevenue(-12930000)).toBe('-1,293만')
    })
  })
})
