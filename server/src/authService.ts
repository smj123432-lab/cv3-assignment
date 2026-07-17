// 라방바 로그인 API 프록시
// 주의: email/password는 어떤 이유로도 로그에 남기지 않는다

interface SignInResponse {
  result: number
  old_sess?: Array<{ sess_id: string }>
}

const SIGN_IN_URL = 'https://live.ecomm-data.com/api/user/sign_in'

// 브라우저 fetch wrapper가 항상 포함하는 헤더
const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'domain': 'ecomm-data.com',
}

async function callSignIn(
  body: Record<string, unknown>,
): Promise<{ res: Response; data: SignInResponse }> {
  const res = await fetch(SIGN_IN_URL, {
    method: 'POST',
    headers: BASE_HEADERS,
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as SignInResponse
  return { res, data }
}

function extractCookie(res: Response): string {
  const setCookieHeader = res.headers.get('set-cookie')
  if (!setCookieHeader) {
    throw new Error('서버에서 세션 쿠키를 받지 못했습니다')
  }

  // Koa 세션은 sales2(데이터)와 sales2.sig(서명) 두 쿠키를 함께 사용
  // 업스트림 API 호출 시 둘 다 전달해야 인증됨
  const sales2Match = setCookieHeader.match(/sales2(?!\.sig)=([^;]+)/)
  const sales2SigMatch = setCookieHeader.match(/sales2\.sig=([^;]+)/)
  if (!sales2Match || !sales2SigMatch) {
    throw new Error('세션 쿠키(sales2 / sales2.sig)를 찾을 수 없습니다')
  }

  return `sales2=${sales2Match[1]}; sales2.sig=${sales2SigMatch[1]}`
}

export async function loginToLabangba(email: string, password: string): Promise<string> {
  // 1차 시도
  const { res: res1, data: data1 } = await callSignIn({ email, password })

  if (!res1.ok) {
    throw new Error('로그인 실패: 이메일 또는 비밀번호를 확인해주세요')
  }

  if (data1.result === 1) {
    return extractCookie(res1)
  }

  // result: 5 = 동시 접속 세션 초과
  // 브라우저는 old_sess 목록을 보여주고 사용자가 하나를 선택해 종료 후 재접속
  // 프록시에서는 자동으로 첫 번째 세션을 선택해 종료 후 재로그인
  if (data1.result === 5) {
    const oldSess = data1.old_sess
    if (!oldSess?.length) {
      throw new Error('기존 세션 정보를 가져오지 못했습니다')
    }

    const { res: res2, data: data2 } = await callSignIn({
      email,
      password,
      sess_id: oldSess[0].sess_id,
    })

    if (!res2.ok) {
      throw new Error('로그인 실패 (세션 종료 후 재시도 중)')
    }
    if (data2.result !== 1) {
      throw new Error(`예상치 못한 응답: result=${data2.result}`)
    }

    return extractCookie(res2)
  }

  const ERROR_MESSAGES: Record<number, string> = {
    2: '가입 정보가 없습니다',
    3: '비밀번호가 일치하지 않습니다',
    4: '비밀번호 오류 횟수 초과. 비밀번호를 재설정해 주세요',
  }
  throw new Error(ERROR_MESSAGES[data1.result] ?? `알 수 없는 응답: result=${data1.result}`)
}
