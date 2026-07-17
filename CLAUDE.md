# CLAUDE.md

이 프로젝트는 CV3 채용 기술과제입니다. Claude Code로 작업을 도와줄 때 아래 규칙을 반드시 지켜주세요.

## 과제 배경

- 라방바 데이터랩(live.ecomm-data.com)의 "라방"/"홈쇼핑" 랭킹 TOP10을 보여주는 웹 페이지
- 헤더/푸터/사이드바 불필요, 토글 + 테이블만 구현
- 디자인 완성도는 평가 대상 아님. 실무적 접근/문제 해결 방식이 평가 대상
- **지원자가 면접에서 이 코드를 전부 설명하고, 그 자리에서 직접 일부를 수정해야 함**

## 최우선 원칙: 코드는 반드시 지원자 본인이 설명 가능해야 한다

- 이 프로젝트는 실무 경력 없는 부트캠프 5개월차 지원자의 과제입니다.
- 새로운 라이브러리, 패턴, 추상화를 추가하기 전에 "이걸 면접에서 본인이 설명할 수 있는가"를 기준으로 판단해주세요.
- 상태관리 라이브러리(Redux, Zustand 등), 불필요한 커스텀 훅, 과도한 제네릭 타입, 복잡한 디자인 패턴은 지양합니다.
- 기본은 `useState` + 함수형 컴포넌트 + 순수 함수 유틸리티 수준으로 유지합니다.
- 코드를 작성한 뒤에는 무엇을 왜 그렇게 했는지 간단히 요약해서 알려주세요. (지원자가 이해하고 넘어가야 함)

## 절대 금지 사항

- **로그인 세션, 쿠키, 토큰, 계정 자격증명을 코드/커밋/저장소에 절대 포함하지 않는다.** 사용자가 로그인 폼에 직접 입력하는 email/password는 요청 처리 중 메모리에서만 다루고, 절대 파일에 저장하거나 Git에 커밋하지 않는다.
- **`req.body.password`(및 email)는 어떤 이유로도 console.log, 로깅 라이브러리, 파일, DB에 기록하지 않는다.** 에러 핸들링/캐치 블록에서도 요청 body 전체를 그대로 로그로 찍는 습관(`console.log(req.body)`)을 절대 쓰지 않는다 — password 필드가 딸려 나올 수 있음. 에러 로그를 남길 때는 password 필드를 제외하고 남기거나, 아예 "로그인 실패"처럼 값 없는 메시지만 남긴다.
- 로그인 API로 받은 세션 쿠키(`sales2.sig` 등)는 서버 메모리(예: in-memory 세션 스토어)에만 보관하고, 파일/DB에 영구 저장하지 않는다.
- 데이터 값을 임의로 반올림하거나 형식을 바꾸지 않는다. 원본 페이지에 보이는 표기 그대로 유지한다 (예: 매출액 "352만"은 숫자로 변환하지 않고 문자열 그대로).
- Next.js 등 이 과제 스코프에 불필요한 프레임워크로 전환하지 않는다. 현재 client(React+TS, Vite) / server(Node+Express+TS) 구조를 유지한다.

## 로그인 연동 관련 (실시간 값 반영을 위해 구현)

- 안내문 확인 결과: 조회수/판매량/매출액/시청률 값은 실시간으로 과제 테이블과 동일하게 나와야 함 (특정 시점 고정 스냅샷 금지, CV3 담당자 확인 완료).
- 이 값들은 로그인 상태에서만 실제 숫자로 내려오고(비로그인 시 null), 요금제 여부와는 무관함(로그인만으로 풀림, 실제 확인됨).
- 사용자가 프론트 로그인 폼에 직접 email/password를 입력하고, 그 값을 그대로 서버가 받아 라방바 로그인 API로 전달하는 방식으로 구현한다. 자동화된 계정 자격증명 하드코딩(.env 등)은 쓰지 않는다 — 항상 그 순간 사용자가 입력한 값만 사용.

### 라방바 로그인 API
- URL: https://live.ecomm-data.com/api/user/sign_in
- Method: POST
- Body: { "email": "...", "password": "..." } (JSON)
- 성공 응답: { user_id, nickname, user_type, sess_id, ... } JSON
- 세션은 Set-Cookie: sales2.sig=...; domain=ecomm-data.com; secure; httponly 형태로 내려옴 (httpOnly라 브라우저 JS로는 읽기 불가, 서버가 다뤄야 함)

### 라방바 데이터 API
- URL: https://live.ecomm-data.com/api/assignment/list
- Method: POST
- Body: {"type":"lb"} 라방 / {"type":"hs"} 홈쇼핑
- 로그인 세션 쿠키(sales2.sig)를 실어서 요청하면 visit_cnt, sales_cnt, sales_amt가 실제 숫자로 옴 (세션 없으면 null)

### 서버 구현 방향
- POST /api/login: body로 email/password를 받아 라방바 로그인 API에 그대로 전달 → 응답의 Set-Cookie를 파싱해서 서버 세션(우리 서버가 발급하는 자체 세션 id ↔ 라방바 쿠키 매핑, 메모리 Map 등)에 저장 → 우리 서버의 세션 식별자를 클라이언트에 쿠키로 내려줌
- GET /api/broadcasts?type=lb|hs: 클라이언트의 우리 서버 세션 쿠키를 확인 → 매핑된 라방바 쿠키가 있으면 그걸 실어서 assignment/list 호출(로그인 상태) → 없으면 쿠키 없이 호출(비로그인 상태, 잠긴 필드는 null로 옴)
- 로그아웃/서버 재시작 시 메모리에 저장된 세션은 사라짐 — 이건 의도된 동작(영구 저장하지 않기 위함)

## 데이터 관련

- 데이터 소스: `https://live.ecomm-data.com/api/assignment/list` (POST, body `{"type":"lb"}` 라방 / `{"type":"hs"}` 홈쇼핑)
- 라방 응답 필드: `visit_cnt`(조회수), `sales_cnt`(판매량), `sales_amt`(매출액), `product_cnt`(상품수), `title`, `cid`(분류), `datetime_start`
- 홈쇼핑 응답 필드: `hsshow_title`, `hsshow_datetime_start`, `item_cnt`(상품수), `sales_cnt`, `sales_amt`, `cat.cat_name`(분류) — 시청률에 대응하는 필드는 응답에 없음(프론트에서 잠금 처리만 됨)
- 실시간 랭킹이라 조회 시점마다 값이 달라짐.
- 라방(lb) API의 카테고리 이름 미제공 문제는 다각도로 조사 완료(API 응답 필드, 별도 카테고리 엔드포인트, 사이트 JS 번들, Next.js __NEXT_DATA__, 개별 방송 상세 API 전부 확인). 결론: 카테고리명 변환은 사이트의 Next.js 서버 내부에서만 처리되고 클라이언트로는 cid 숫자만 전달됨 - 브라우저 네트워크 레벨에서는 원리적으로 접근 불가능한 정보. CID_NAMES 매핑 + "기타(cid:...)" fallback이 이 제약 하의 최종 구현이며 더 이상 개선 여지 없음(새 cid 발견 시 수동 추가는 계속 가능).

## 파일 구조 (임의로 재구성하지 말 것)

```
cv3-assignment/
├── client/                      # React + TypeScript (Vite)
│   ├── src/
│   │   ├── App.tsx              # 탭·로그인 상태, fetch, 로그인 폼
│   │   ├── BroadcastTable.tsx   # 테이블 렌더링 (null이면 🔒 표시)
│   │   ├── formatDateTime.ts    # ISO → "26.07.17 (금) 14:00" 변환
│   │   ├── formatRevenue.ts     # 원단위 숫자 → 조/억/만 단위 표기 변환
│   │   ├── types.ts             # Broadcast 타입 정의
│   │   ├── main.tsx             # React 진입점
│   │   └── index.css
│   ├── index.html
│   ├── tsconfig.json
│   └── package.json
│
└── server/                      # Node + Express + TypeScript
    ├── src/
    │   ├── index.ts             # Express 서버, 라우트 정의
    │   │                        # POST /api/login · /api/logout · GET /api/me · /api/broadcasts
    │   ├── authService.ts       # 라방바 로그인 API 중계, 세션 쿠키 파싱
    │   ├── session.ts           # 인메모리 세션 스토어 (Map<sessionId, cookie>)
    │   ├── broadcastService.ts  # 외부 API 호출, 필드 변환, TOP10 추출
    │   └── types.ts             # 서버 내부 타입 정의
    ├── tsconfig.json
    └── package.json
```

## 커밋 규칙

- 커밋을 하나로 뭉치지 말고 작업 단위로 나눠서 커밋한다 (안내문 요구사항).
  - 작업 단위 예시: 프로젝트 셋업 / 데이터 정의(data.js) / 토글 UI / 테이블 컴포넌트 / 날짜 포맷 유틸 / 스타일링 / API 연동(스크래핑) / README 작성 — 이런 식으로 커밋을 쪼갠다. 여러 관심사를 한 커밋에 섞지 않는다.
- 커밋 메시지는 무엇을/왜 했는지 명확히 남긴다. 면접에서 이 로그를 보고 설명하게 됨.
- 기능 브랜치를 새로 만들 때는 그 브랜치가 담당하는 작업 범위를 벗어나는 변경을 같이 커밋하지 않는다.

## 브랜치 전략

- `main`: 최종 제출 브랜치. 항상 실행 가능한 상태만 유지.
- `dev`: `main`에서 분기. 작업 통합 브랜치. 기능 브랜치들을 여기로 merge.
- 기능 브랜치: `dev`에서 분기, 작업 단위별로 하나씩 생성 (예: `feature/data-setup`, `feature/toggle-ui`, `feature/table-component`, `feature/api-scraping`, `feature/readme`)
- 작업 흐름: `main` → `dev` 분기 → 기능 브랜치 생성 → 작업 → `dev`로 merge → (모든 기능 완료 후) `dev` → `main`으로 merge
- 기능 브랜치는 merge 후 삭제해도 되고 남겨둬도 됨 (지원자 편한 대로). 단, PR/merge 이력이 커밋 로그에 남도록 `--no-ff` merge를 기본으로 사용.

```bash
# 예시
git checkout main
git checkout -b dev
git checkout -b feature/data-setup
# ... 작업 ...
git add . && git commit -m "라방/홈쇼핑 TOP10 실데이터 반영"
git checkout dev
git merge --no-ff feature/data-setup
```

## 실행 방법 (README와 동일하게 유지)

```bash
# 터미널 1 - 서버
cd server && npm install && npm run dev

# 터미널 2 - 클라이언트
cd client && npm install && npm run dev
```
