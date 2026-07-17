import { randomUUID } from 'crypto'

// 인메모리 세션 스토어: 서버 재시작 시 사라지는 것은 의도된 동작
const store = new Map<string, string>() // sessionId → labangba sales2.sig 쿠키값

export function createSession(labangbaCookie: string): string {
  const id = randomUUID()
  store.set(id, labangbaCookie)
  return id
}

export function getSession(id: string): string | undefined {
  return store.get(id)
}

export function deleteSession(id: string): void {
  store.delete(id)
}
