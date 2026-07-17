# 라방바 데이터랩 - 채용 과제

라방바 데이터랩(live.ecomm-data.com)의 라방·홈쇼핑 실시간 랭킹 TOP10을 보여주는 웹 페이지입니다.

## 실행 방법

터미널 두 개가 필요합니다.

**백엔드 (server/)**

```bash
cd server
npm install
npm run dev   # http://localhost:4000
```

**프론트엔드 (client/)**

```bash
cd client
npm install
npm run dev   # http://localhost:5173
```

## 구현 범위

- 라방 / 홈쇼핑 탭 토글로 목록 전환
- 탭별 실시간 TOP10을 테이블로 표시 (순위 · 방송정보 · 분류 · 방송시간 · 조회수/시청률 · 판매량 · 매출액 · 상품수)
- 비로그인 상태: 제목·채널·분류·방송시간·상품수를 실시간으로 표시, 조회수·판매량·매출액은 🔒
- 로그인 상태: 라방바 계정으로 직접 로그인하면 모든 필드가 실시간으로 표시

## 로그인

우측 상단의 이메일/비밀번호 입력 폼에 라방바 계정 정보를 직접 입력합니다.

- 로그인 성공 시 서버가 세션을 관리하고, 새로고침 후에도 로그인 상태가 유지됩니다.
- 서버 재시작 시 세션이 초기화되므로 다시 로그인이 필요합니다 (의도된 동작).

## 아키텍처

### client / server 분리 이유

1. **CORS 우회**: `live.ecomm-data.com` API를 브라우저에서 직접 호출하면 CORS 오류가 발생합니다. 서버가 대신 호출하고 결과를 프론트에 전달합니다.
2. **세션 보안**: 라방바 로그인 후 발급되는 httpOnly 쿠키는 브라우저 JS로 읽을 수 없습니다. 서버가 이 쿠키를 인메모리 Map에 보관하고, 클라이언트에는 자체 세션 ID만 내려줍니다.
3. **관심사 분리**: 외부 API 호출·필드 변환은 서버, 렌더링·상태 관리는 클라이언트가 담당합니다.

### 데이터 흐름

**비로그인**
```
클라이언트 → GET /api/broadcasts?type=lb
  → 서버: 라방바 API 호출 (세션 없이)
  → 응답: 제목·채널·분류·방송시간·상품수만, 조회수/판매량/매출액은 null
  → 클라이언트: null 필드는 🔒 표시
```

**로그인 흐름**
```
사용자 email/password 입력 → POST /api/login
  → 서버: 라방바 로그인 API에 전달 → sales2 세션 쿠키 수신
  → 서버: 인메모리 Map에 { our_session_id: sales2_cookie } 저장
  → 클라이언트: our_session 쿠키 수신 (httpOnly)

로그인 후 GET /api/broadcasts?type=lb
  → 서버: Map에서 sales2 쿠키 조회 → 라방바 API에 첨부하여 호출
  → 응답: 조회수/판매량/매출액 포함한 전체 데이터
  → 클라이언트: 모든 필드 실시간 표시
```

## 폴더 구조

```
cv3-assignment/
├── client/                        # React + TypeScript (Vite)
│   ├── index.html                 # Vite HTML 진입점, main.tsx를 스크립트로 로드
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── main.tsx               # React 앱 진입점, <App />을 DOM에 마운트
│       ├── App.tsx                # 탭·로그인 상태 관리, 데이터 fetch, 로그인 폼 UI
│       ├── BroadcastTable.tsx     # TOP10 테이블 렌더링 (비로그인 잠긴 값은 🔒 표시)
│       ├── types.ts               # Broadcast 공통 타입 정의 (client 전역)
│       ├── formatDateTime.ts      # "2607171400" → "26.07.17 (금) 14:00" 변환 유틸
│       ├── formatRevenue.ts       # 원단위 숫자 → 조/억/만 단위 한국어 표기 변환 유틸
│       └── index.css              # 전역 스타일 (테이블·폼·레이아웃)
│
└── server/                        # Node + Express + TypeScript
    ├── tsconfig.json
    ├── package.json
    └── src/
        ├── index.ts               # Express 앱 설정, 라우트 정의
        │                          #   POST /api/login · POST /api/logout
        │                          #   GET  /api/me   · GET  /api/broadcasts
        ├── authService.ts         # 라방바 로그인 API 중계, Set-Cookie 파싱
        ├── session.ts             # 인메모리 세션 스토어 (Map<sessionId, labangbaCookie>)
        ├── broadcastService.ts    # 외부 API 호출, CID 매핑, 필드 변환, TOP10 추출
        └── types.ts               # 서버 내부 타입 정의 (LbItem, HsItem 등)
```
