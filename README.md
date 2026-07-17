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
- 비로그인으로 접근 가능한 필드(제목·채널·분류·방송시간·상품수)는 백엔드를 통해 실시간 조회
- 로그인 후에만 보이는 필드(조회수·판매량·매출액)는 계정 자격증명을 코드에 넣지 않기 위해 "로그인" 버튼으로 스냅샷(2026-07-17 기준) 노출
  - 로그아웃 상태: 🔒 표시
  - 로그인 상태: `client/src/lockedSnapshot.ts`에 저장된 수동 확인 값 표시

> **스냅샷 기준일**: 2026-07-17 (금)
> 실시간 랭킹이므로 조회 시점마다 순위와 방송 목록이 달라집니다.
> 로그인 후 표시되는 조회수/판매량/매출액은 위 기준일에 직접 확인한 값이며 현재 순위와 다를 수 있습니다.

## 아키텍처

### client / server 분리 이유

1. **CORS 우회**: `live.ecomm-data.com` API를 브라우저에서 직접 호출하면 CORS 오류가 발생합니다. 서버가 대신 호출하고 결과를 프론트에 전달합니다.
2. **백엔드 경험 시연**: Node + Express + TypeScript 구성으로 서버 사이드 코드도 작성할 수 있음을 보여줍니다.
3. **관심사 분리**: 외부 API 호출·필드 변환은 서버, 렌더링·상태 관리는 클라이언트가 담당합니다.

### 데이터 흐름

```
외부 API (live.ecomm-data.com)
  → server/src/broadcastService.ts  (비로그인 호출, 잠긴 필드 제외)
  → GET /api/broadcasts?type=lb|hs
  → client/src/App.tsx              (fetch → UnlockedFields[])
  → lockedSnapshot.ts과 rank 기준 merge → Broadcast[]
  → isLoggedIn ? 실제 값 : null
  → BroadcastTable.tsx              (렌더링)
```

## 폴더 구조

```
cv3-assignment/
├── client/                      # React + TypeScript (Vite)
│   ├── src/
│   │   ├── App.tsx              # 탭·로그인 상태 관리, fetch, snapshot merge
│   │   ├── BroadcastTable.tsx   # 테이블 렌더링 (Broadcast[] props)
│   │   ├── lockedSnapshot.ts    # 로그인 시 노출 값 스냅샷 (rank 키 객체)
│   │   ├── formatDateTime.ts    # ISO → "26.07.17 (금) 14:00" 변환
│   │   ├── types.ts             # UnlockedFields / LockedSnapshot / Broadcast 타입
│   │   └── index.css
│   ├── index.html
│   ├── tsconfig.json
│   └── package.json
│
└── server/                      # Node + Express + TypeScript
    ├── src/
    │   ├── index.ts             # Express 서버, GET /api/broadcasts 라우트
    │   ├── broadcastService.ts  # 외부 API 호출, 필드 변환, 상위 10개 추출
    │   └── types.ts             # UnlockedBroadcast 인터페이스
    ├── tsconfig.json
    └── package.json
```
