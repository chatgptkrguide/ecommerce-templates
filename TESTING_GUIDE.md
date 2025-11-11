# 테스트 가이드 / Testing Guide

## 개요

이 가이드는 상품 둘러보기와 관리자 페이지 기능을 테스트하는 방법을 설명합니다.

## 🚀 빠른 시작 (로컬 환경)

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 데이터베이스
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-characters-long"

# 앱 설정
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. 데이터베이스 초기화

```bash
# Prisma Client 생성
npm run db:generate

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 샘플 데이터 추가 (중요!)
npm run db:seed
```

### 3. 개발 서버 실행

```bash
npm run dev
```

서버가 실행되면: http://localhost:3000

## 📋 테스트 체크리스트

### ✅ 홈페이지 테스트

1. **URL**: http://localhost:3000
2. **확인 사항**:
   - [x] 페이지가 정상적으로 로드됨
   - [x] "상품 둘러보기" 버튼 표시
   - [x] "관리자 페이지" 버튼 표시
   - [x] 버튼 클릭 시 해당 페이지로 이동

### ✅ 상품 둘러보기 테스트

1. **URL**: http://localhost:3000/products

2. **데이터베이스 연결 없을 때**:
   - [x] 오류 메시지 표시
   - [x] "데이터베이스 연결 오류" 안내
   - [x] 환경변수 설정 안내 표시

3. **데이터베이스 연결됐지만 데이터 없을 때**:
   - [x] "상품이 없습니다" 메시지 표시
   - [x] `npm run db:seed` 안내 표시

4. **정상 작동 시** (db:seed 실행 후):
   - [x] 좌측에 카테고리 목록 표시
   - [x] 상품 카드 그리드 표시 (최대 12개)
   - [x] 각 상품 카드에 이미지, 이름, 가격 표시
   - [x] 할인 상품에 할인율 배지 표시
   - [x] 카테고리 클릭 시 필터링 작동
   - [x] 상품 클릭 시 상세 페이지로 이동

### ✅ 상품 상세 페이지 테스트

1. **URL**: http://localhost:3000/products/[slug]

2. **확인 사항**:
   - [x] 상품 이미지 갤러리 표시
   - [x] 상품명, 카테고리, 가격 표시
   - [x] 평점 및 리뷰 수 표시
   - [x] 재고 상태 표시
   - [x] "장바구니 담기" 버튼
   - [x] "바로 구매" 버튼
   - [x] 상품 설명 표시
   - [x] 고객 리뷰 섹션 (있는 경우)

### ✅ 관리자 대시보드 테스트

1. **URL**: http://localhost:3000/admin

2. **레이아웃 확인**:
   - [x] 좌측 사이드바 표시
   - [x] 사이드바 메뉴 항목들 표시
     - 대시보드
     - 상품 관리
     - 주문 관리
     - 고객 관리
     - 설정
   - [x] "쇼핑몰로 돌아가기" 링크

3. **대시보드 통계 카드**:
   - [x] 전체 상품 수 표시
   - [x] 전체 주문 수 표시
   - [x] 전체 고객 수 표시
   - [x] 총 매출 표시
   - [x] 각 카드에 적절한 아이콘 표시

4. **최근 주문 섹션**:
   - [x] 최근 5개 주문 표시
   - [x] 주문번호, 고객명, 금액, 상태 표시
   - [x] 주문이 없을 때 "주문이 없습니다" 메시지

### ✅ 관리자 상품 관리 테스트

1. **URL**: http://localhost:3000/admin/products

2. **확인 사항**:
   - [x] 상품 목록 테이블 표시
   - [x] "새 상품 추가" 버튼
   - [x] 상품 이미지 썸네일
   - [x] 상품명, 카테고리, 가격, 재고, 상태 표시
   - [x] 편집 버튼
   - [x] 삭제 버튼
   - [x] 재고가 적을 때 색상 변경 (노란색/빨간색)
   - [x] 상품이 없을 때 안내 메시지 및 시드 명령어

### ✅ 관리자 주문 관리 테스트

1. **URL**: http://localhost:3000/admin/orders

2. **확인 사항**:
   - [x] 주문 목록 테이블 표시
   - [x] 주문번호, 고객명, 상품 수, 금액, 상태 표시
   - [x] 주문일시 표시
   - [x] 상태별 색상 배지
     - 대기중: 노란색
     - 처리중: 파란색
     - 배송중: 보라색
     - 완료: 초록색
     - 취소: 빨간색
   - [x] "상세" 버튼
   - [x] 주문이 없을 때 안내 메시지

## 🔧 문제 해결

### 데이터베이스 연결 오류

**증상**: "Environment variable not found: DATABASE_URL" 오류

**해결방법**:
```bash
# 1. .env.local 파일 확인
cat .env.local

# 2. DATABASE_URL이 있는지 확인
# 3. 없으면 추가:
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"' >> .env.local

# 4. 개발 서버 재시작
npm run dev
```

### 상품이 표시되지 않음

**증상**: "상품이 없습니다" 메시지

**해결방법**:
```bash
# 샘플 데이터 추가
npm run db:seed

# 브라우저 새로고침
```

### Prisma Client 오류

**증상**: "PrismaClient is unable to run in this browser environment"

**해결방법**:
```bash
# Prisma Client 재생성
npx prisma generate

# 개발 서버 재시작
npm run dev
```

### 이미지가 표시되지 않음

**증상**: 상품 이미지가 깨지거나 표시되지 않음

**해결방법**:
- 시드 데이터는 placeholder 이미지를 사용합니다
- 인터넷 연결을 확인하세요
- 이미지 URL이 유효한지 확인하세요

## 🌐 Vercel 배포 환경 테스트

### 1. 환경 변수 설정 확인

Vercel 대시보드에서:
- Settings → Environment Variables
- 필수 변수 확인:
  - `DATABASE_URL`
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
  - `NEXT_PUBLIC_APP_URL`

### 2. 데이터베이스 초기화

```bash
# 로컬에서 Vercel 환경변수 가져오기
vercel env pull

# 마이그레이션 실행
npx prisma migrate deploy

# 샘플 데이터 추가
npm run db:seed
```

### 3. 테스트 URL

- **홈**: https://your-app.vercel.app
- **상품**: https://your-app.vercel.app/products
- **관리자**: https://your-app.vercel.app/admin

### 4. 배포 로그 확인

오류 발생 시:
1. Vercel 대시보드 → Deployments
2. 최신 배포 클릭
3. "Function Logs" 탭에서 오류 확인

## 📊 성능 테스트

### 페이지 로드 시간

- **홈페이지**: < 1초
- **상품 목록**: < 2초
- **상품 상세**: < 2초
- **관리자 대시보드**: < 2초

### 데이터베이스 쿼리

```bash
# Prisma Studio로 데이터 확인
npx prisma studio
```

브라우저에서 http://localhost:5555 열림

## 🧪 자동화 테스트 (향후 구현)

현재 구현된 기능:
- [x] 에러 핸들링
- [x] 데이터베이스 연결 확인
- [x] 빈 상태 UI

향후 추가할 테스트:
- [ ] E2E 테스트 (Playwright)
- [ ] API 엔드포인트 테스트
- [ ] 단위 테스트
- [ ] 통합 테스트

## 📝 피드백

테스트 중 문제를 발견하면:
1. 브라우저 콘솔 확인 (F12)
2. 서버 로그 확인
3. GitHub Issues에 보고

## ✨ 추가 기능 테스트 (데이터베이스 연결 후)

### 장바구니 기능
- 상품을 장바구니에 추가
- 수량 변경
- 삭제

### 주문 기능
- 주문 생성
- 주문 내역 확인
- 주문 상태 업데이트

### 사용자 인증
- 회원가입
- 로그인
- 로그아웃

이 모든 기능은 데이터베이스가 올바르게 설정된 후 테스트 가능합니다.
