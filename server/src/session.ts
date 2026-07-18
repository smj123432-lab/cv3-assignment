import { randomUUID } from 'crypto'

// 서버 재시작 시 세션이 사라지는 건 의도된 동작입니다. 영구 저장하지 않기 위해 메모리에만 둡니다
const store = new Map<string, string>() // sessionId → 라방바 sales2 쿠키값

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
