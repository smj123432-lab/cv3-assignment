// 라방바 로그인 API 프록시
// 주의: email/password는 어떤 이유로도 로그에 남기지 않는다
export async function loginToLabangba(email: string, password: string): Promise<string> {
  const res = await fetch('https://live.ecomm-data.com/api/user/sign_in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error('로그인 실패: 이메일 또는 비밀번호를 확인해주세요')
  }

  const setCookieHeader = res.headers.get('set-cookie')
  if (!setCookieHeader) {
    throw new Error('서버에서 세션 쿠키를 받지 못했습니다')
  }

  // "sales2.sig=XXX; domain=...; ..." 형태에서 값만 추출
  const match = setCookieHeader.match(/sales2\.sig=([^;]+)/)
  if (!match) {
    throw new Error('sales2.sig 쿠키를 찾을 수 없습니다')
  }

  return match[1]
}
