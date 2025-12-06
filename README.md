# Trade Safety

[![Status](https://img.shields.io/website?url=https%3A%2F%2Faioia.ai%2Ftrade-safety&label=Status)](https://aioia.ai/trade-safety)

K-pop 굿즈 거래글 AI 분석 서비스 - Full-stack Next.js 애플리케이션

---

## 주요 기능

- LLM 기반 거래글 분석 (한국어 슬랭 이해)
- 사기 신호 탐지 (Risk Signals, Cautions, Safe Indicators)
- 가격 분석 (시세 비교)
- 안전 체크리스트
- 감정 지원 (FOMO 완화)
- 6개 언어 지원 (en, ko, ja, zh, es, id)

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | Drizzle ORM + Vercel Postgres |
| LLM | OpenAI SDK (Structured Outputs + Zod) |
| Styling | Tailwind CSS + DaisyUI |
| i18n | i18next |

---

## 빠른 시작

### 환경 설정

```bash
cp .env.example .env.local
# .env.local에 환경변수 설정
```

### 개발 서버

```bash
npm install
npm run dev
```

접속: http://localhost:3000

### 데이터베이스

```bash
# 스키마를 DB에 푸시 (개발용)
npm run db:push

# 마이그레이션 생성
npm run db:generate

# 마이그레이션 실행
npm run db:migrate
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── trade-safety/     # API Routes
│   └── [lang]/               # 다국어 페이지
├── components/               # React 컴포넌트
├── db/                       # Drizzle 스키마
├── prompts/                  # LLM 프롬프트
├── repositories/             # API 클라이언트
├── schemas/                  # Zod 스키마
├── services/                 # 비즈니스 로직
└── i18n/                     # 번역 파일
```

---

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/trade-safety | 거래글 분석 생성 |
| GET | /api/trade-safety/[id] | 분석 결과 조회 |

현재 Public-only 모드: 모든 요청에 QuickCheck 응답 반환

---

## 환경변수

| 변수 | 설명 |
|------|------|
| `POSTGRES_URL` | Vercel Postgres 연결 문자열 |
| `OPENAI_API_KEY` | OpenAI API 키 |

---

## 문서

- [기여 가이드](CONTRIBUTING.md)
- [개발 원칙](CLAUDE.md)

---

## 라이선스

Apache 2.0
