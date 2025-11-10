import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth/auth-options'
import { nanoid } from 'nanoid'

interface OrderItemInput {
  productId: string
  variantId?: string
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress, paymentMethod, couponCode } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: '주문할 상품이 없습니다' },
        { status: 400 }
      )
    }

    // 상품 정보 및 재고 확인
    const productIds = items.map((item: OrderItemInput) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE' },
    })

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: '일부 상품을 찾을 수 없습니다' },
        { status: 400 }
      )
    }

    // 재고 확인
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product?.name || '상품'}의 재고가 부족합니다` },
          { status: 400 }
        )
      }
    }

    // 총액 계산
    let totalAmount = 0
    const orderItems = items.map((item: OrderItemInput) => {
      const product = products.find((p) => p.id === item.productId)!
      const subtotal = product.price * item.quantity
      totalAmount += subtotal

      return {
        productId: item.productId,
        variantId: item.variantId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      }
    })

    // 쿠폰 적용
    let discountAmount = 0
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode, status: 'ACTIVE' },
      })

      if (coupon) {
        const now = new Date()
        if (coupon.validFrom <= now && coupon.validUntil >= now) {
          if (!coupon.minPurchase || totalAmount >= coupon.minPurchase) {
            if (coupon.discountType === 'PERCENTAGE') {
              discountAmount = Math.floor(
                (totalAmount * coupon.discountValue) / 100
              )
              if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscount)
              }
            } else if (coupon.discountType === 'FIXED') {
              discountAmount = coupon.discountValue
            }
          }
        }
      }
    }

    // 배송비 계산 (5만원 이상 무료배송)
    const shippingAmount = totalAmount >= 50000 ? 0 : 3000

    const finalAmount = totalAmount - discountAmount + shippingAmount

    // 트랜잭션으로 주문 생성
    const order = await prisma.$transaction(async (tx) => {
      // 1. 주문 생성
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `ORD-${nanoid(10)}`,
          userId: session.user.id,
          status: 'PENDING',
          totalAmount: finalAmount,
          shippingAmount,
          discountAmount,
          paymentMethod,
          shippingAddress,
          couponCode,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      })

      // 2. 재고 차감
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        })
      }

      // 3. 쿠폰 사용 횟수 증가
      if (couponCode) {
        await tx.coupon.update({
          where: { code: couponCode },
          data: {
            usageCount: { increment: 1 },
          },
        })
      }

      return newOrder
    })

    return NextResponse.json(
      {
        message: '주문이 완료되었습니다',
        order,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: '주문 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 주문 목록 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: { take: 1 },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: '주문 목록을 불러오는데 실패했습니다' },
      { status: 500 }
    )
  }
}
