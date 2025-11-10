import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. 사용자 생성
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '관리자',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: '홍길동',
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  })

  console.log('✅ Users created:', { admin: admin.email, customer: customer.email })

  // 2. 카테고리 생성
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: '전자제품',
      slug: 'electronics',
      description: '최신 전자제품 모음',
    },
  })

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: '패션',
      slug: 'fashion',
      description: '트렌디한 패션 아이템',
    },
  })

  const homeAndLiving = await prisma.category.upsert({
    where: { slug: 'home-and-living' },
    update: {},
    create: {
      name: '홈&리빙',
      slug: 'home-and-living',
      description: '집을 아름답게 꾸미는 제품들',
    },
  })

  console.log('✅ Categories created')

  // 3. 상품 생성
  const products = [
    {
      name: '무선 이어폰 Pro',
      slug: 'wireless-earbuds-pro',
      description: '뛰어난 음질과 노이즈 캔슬링 기능을 갖춘 프리미엄 무선 이어폰입니다. 최대 30시간 재생 시간, IPX4 방수 등급으로 운동할 때도 안심하고 사용할 수 있습니다.',
      price: 129000,
      compareAtPrice: 179000,
      stock: 50,
      status: 'ACTIVE' as const,
      featured: true,
      tags: ['전자제품', '이어폰', '무선', '신제품'],
      categoryId: electronics.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', alt: '무선 이어폰 메인', order: 0 },
        { url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800', alt: '무선 이어폰 측면', order: 1 },
      ],
    },
    {
      name: '스마트워치 X1',
      slug: 'smartwatch-x1',
      description: '건강 관리와 스마트한 라이프스타일을 위한 최고의 선택. 심박수 모니터링, 수면 추적, 50개 이상의 운동 모드를 지원합니다.',
      price: 299000,
      compareAtPrice: 399000,
      stock: 30,
      status: 'ACTIVE' as const,
      featured: true,
      tags: ['전자제품', '스마트워치', 'wearable'],
      categoryId: electronics.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800', alt: '스마트워치', order: 0 },
      ],
    },
    {
      name: '프리미엄 백팩',
      slug: 'premium-backpack',
      description: '도시와 자연을 오가는 현대인을 위한 프리미엄 백팩. 방수 원단과 인체공학적 디자인으로 편안한 착용감을 제공합니다.',
      price: 89000,
      stock: 100,
      status: 'ACTIVE' as const,
      tags: ['패션', '가방', '백팩', '여행'],
      categoryId: fashion.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', alt: '백팩', order: 0 },
      ],
    },
    {
      name: '미니멀 스니커즈',
      slug: 'minimal-sneakers',
      description: '깔끔한 디자인과 편안한 착화감의 미니멀 스니커즈. 어떤 스타일에도 매치하기 좋습니다.',
      price: 79000,
      compareAtPrice: 99000,
      stock: 150,
      status: 'ACTIVE' as const,
      featured: true,
      tags: ['패션', '신발', '스니커즈'],
      categoryId: fashion.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', alt: '스니커즈', order: 0 },
      ],
    },
    {
      name: '북유럽 스타일 조명',
      slug: 'nordic-lamp',
      description: '따뜻한 빛과 미니멀한 디자인의 북유럽 스타일 테이블 조명. 거실, 침실, 서재 등 어디에나 어울립니다.',
      price: 45000,
      stock: 80,
      status: 'ACTIVE' as const,
      tags: ['홈인테리어', '조명', '북유럽'],
      categoryId: homeAndLiving.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', alt: '조명', order: 0 },
      ],
    },
    {
      name: '세라믹 머그컵 세트',
      slug: 'ceramic-mug-set',
      description: '감성적인 색감의 세라믹 머그컵 4개 세트. 커피, 차, 우유 등 다양한 음료를 즐기기에 완벽합니다.',
      price: 32000,
      stock: 200,
      status: 'ACTIVE' as const,
      tags: ['주방용품', '머그컵', '세라믹'],
      categoryId: homeAndLiving.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800', alt: '머그컵', order: 0 },
      ],
    },
  ]

  for (const productData of products) {
    const { images, ...product } = productData
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        images: {
          create: images,
        },
      },
    })
    console.log(`✅ Product created: ${createdProduct.name}`)
  }

  // 4. 쿠폰 생성
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      name: '신규 회원 10% 할인',
      description: '첫 구매 시 10% 할인',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minPurchase: 50000,
      maxDiscount: 30000,
      usageLimit: 1000,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90일 후
      status: 'ACTIVE',
    },
  })

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      name: '무료배송 쿠폰',
      description: '5만원 이상 구매 시 무료배송',
      discountType: 'FREE_SHIPPING',
      discountValue: 0,
      minPurchase: 50000,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
      status: 'ACTIVE',
    },
  })

  console.log('✅ Coupons created')

  // 5. 샘플 리뷰 생성
  const firstProduct = await prisma.product.findFirst({
    where: { slug: 'wireless-earbuds-pro' },
  })

  if (firstProduct) {
    await prisma.review.create({
      data: {
        productId: firstProduct.id,
        userId: customer.id,
        rating: 5,
        title: '정말 만족스러운 제품이에요!',
        content: '음질도 좋고 배터리도 오래가서 매우 만족스럽습니다. 노이즈 캔슬링 기능도 훌륭해요!',
        verified: true,
        helpful: 15,
      },
    })
    console.log('✅ Sample review created')
  }

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
