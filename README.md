# 🛒 Basic Storefront - 이커머스 쇼핑몰 템플릿

완전한 기능을 갖춘 현대적인 이커머스 쇼핑몰 템플릿입니다.

## ✨ 주요 기능

### 🎯 구현 완료된 기능
- ✅ **인증 시스템** - NextAuth.js를 사용한 이메일/비밀번호 로그인
- ✅ **상품 관리** - 카테고리, 이미지, 옵션, 재고 관리
- ✅ **장바구니** - Zustand를 사용한 영구 저장 장바구니
- ✅ **주문 시스템** - 완전한 주문 처리 워크플로우
- ✅ **리뷰 시스템** - 별점, 이미지 업로드, 구매 확정 리뷰
- ✅ **쿠폰 시스템** - 정액/정률 할인, 무료배송 쿠폰
- ✅ **배송지 관리** - 다중 배송지 저장 및 관리

### 🏗 데이터베이스 스키마
완전한 이커머스 데이터 모델:
- User (사용자, 역할 관리)
- Product (상품, 옵션, 이미지)
- Category (계층형 카테고리)
- Order (주문, 상태 추적)
- Review (리뷰, 평점)
- Coupon (쿠폰, 프로모션)
- Cart (장바구니)
- Address (배송지)

## 🛠 기술 스택

### Frontend
- **Next.js 14** - App Router, Server Components
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 우선 CSS
- **Radix UI** - 접근성 높은 UI 컴포넌트
- **Zustand** - 상태 관리
- **React Query** - 서버 상태 관리
- **React Hook Form + Zod** - 폼 검증

### Backend
- **Prisma** - ORM 및 데이터베이스 마이그레이션
- **PostgreSQL** - 관계형 데이터베이스
- **NextAuth.js** - 인증 및 세션 관리
- **bcryptjs** - 비밀번호 해싱

## 🚀 빠른 시작

### 1. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 만듭니다:

\`\`\`bash
cp .env.example .env
\`\`\`

필수 환경 변수:
- `DATABASE_URL` - PostgreSQL 연결 문자열
- `NEXTAUTH_SECRET` - NextAuth 시크릿 (최소 32자)
- `NEXTAUTH_URL` - 애플리케이션 URL

### 2. 의존성 설치

\`\`\`bash
npm install
# or
pnpm install
# or
yarn install
\`\`\`

### 3. 데이터베이스 설정

\`\`\`bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션
npm run db:push

# 샘플 데이터 삽입
npm run db:seed
\`\`\`

샘플 계정:
- **관리자**: admin@example.com / password123
- **고객**: customer@example.com / password123

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 📁 프로젝트 구조

\`\`\`
ecommerce-templates/
├── prisma/
│   ├── schema.prisma          # 데이터베이스 스키마
│   └── seed.ts                # 샘플 데이터
├── src/
│   ├── app/
│   │   ├── (storefront)/      # 고객용 페이지
│   │   ├── (admin)/           # 관리자 페이지
│   │   ├── api/               # API 라우트
│   │   └── auth/              # 인증 페이지
│   ├── components/
│   │   ├── ui/                # 재사용 가능한 UI 컴포넌트
│   │   ├── products/          # 상품 관련 컴포넌트
│   │   ├── cart/              # 장바구니 컴포넌트
│   │   └── orders/            # 주문 관련 컴포넌트
│   ├── lib/
│   │   ├── auth/              # 인증 설정
│   │   ├── db/                # 데이터베이스 클라이언트
│   │   ├── stores/            # Zustand 스토어
│   │   └── utils.ts           # 유틸리티 함수
│   └── types/                 # TypeScript 타입 정의
└── public/                    # 정적 파일
\`\`\`

## 🎨 주요 컴포넌트

### ProductCard
상품 카드 컴포넌트 - 상품 이미지, 이름, 가격, 할인율 표시

### CartStore
장바구니 상태 관리:
- `addItem()` - 상품 추가
- `removeItem()` - 상품 제거
- `updateQuantity()` - 수량 변경
- `totalAmount()` - 총 금액 계산

## 🔐 인증 시스템

NextAuth.js를 사용한 안전한 인증:
- 이메일/비밀번호 로그인
- JWT 세션
- 역할 기반 접근 제어 (CUSTOMER, ADMIN, SELLER)
- 비밀번호 해싱 (bcrypt)

## 💾 데이터베이스 모델

### 주요 모델
- **User** - 사용자 정보 및 역할
- **Product** - 상품 정보, 가격, 재고
- **ProductImage** - 상품 이미지
- **ProductVariant** - 상품 옵션 (색상, 사이즈 등)
- **Category** - 계층형 카테고리
- **Order** - 주문 정보 및 상태
- **OrderItem** - 주문 상품 목록
- **Review** - 상품 리뷰 및 평점
- **Coupon** - 할인 쿠폰
- **Cart** - 장바구니
- **Address** - 배송지 정보

## 📝 사용 가능한 스크립트

\`\`\`bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# 타입 체크
npm run type-check

# 데이터베이스 명령어
npm run db:generate      # Prisma 클라이언트 생성
npm run db:push          # 스키마 푸시
npm run db:migrate       # 마이그레이션 생성
npm run db:seed          # 샘플 데이터 삽입
npm run db:studio        # Prisma Studio 실행

# 테스트
npm run test             # 유닛 테스트
npm run test:e2e         # E2E 테스트
\`\`\`

## 🔒 보안 기능

- ✅ SQL Injection 방지 (Prisma ORM)
- ✅ XSS 방지
- ✅ 비밀번호 해싱 (bcrypt)
- ✅ JWT 세션 보안
- ✅ 환경 변수 보호
- ✅ CORS 설정
- ⚠️ CSRF 토큰 (구현 예정)
- ⚠️ Rate Limiting (구현 예정)

## 🎯 다음 단계

### 구현 예정 기능
- [ ] 상품 검색 및 필터링 (Elasticsearch/Algolia)
- [ ] 결제 통합 (Stripe, Toss Payments)
- [ ] 이미지 업로드 (Cloudinary)
- [ ] 관리자 대시보드
- [ ] 이메일 알림 (Resend)
- [ ] 성능 최적화 (ISR, 이미지 최적화)
- [ ] E2E 테스트 (Playwright)

## 📚 학습 자료

- [Next.js 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [NextAuth.js 문서](https://next-auth.js.org)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Zustand 문서](https://zustand-demo.pmnd.rs)

## ⚠️ 주의사항

**이 템플릿은 학습 및 프로토타입 제작용입니다.**

프로덕션 배포 전 반드시 확인:
- [ ] 환경 변수 보안
- [ ] 데이터베이스 백업
- [ ] SSL 인증서 설치
- [ ] 전자상거래법 준수
- [ ] 개인정보 처리방침
- [ ] 이용약관 작성
- [ ] PG사 연동 및 검수
- [ ] 성능 테스트
- [ ] 보안 감사

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 🤝 기여

이슈 등록 및 Pull Request를 환영합니다!

---

**Made with ❤️ for Learning E-commerce Development**
