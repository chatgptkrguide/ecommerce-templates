import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/card'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboardPage() {
  let stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  }
  let recentOrders = []
  let error = null

  try {
    const [products, orders, customers] = await Promise.all([
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.user.count(),
    ])

    // 총 매출 계산
    const revenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: 'COMPLETED',
      },
    })

    stats = {
      totalProducts: products,
      totalOrders: orders.length,
      totalCustomers: customers,
      totalRevenue: revenue._sum.totalAmount || 0,
    }

    recentOrders = orders
  } catch (e) {
    console.error('Dashboard error:', e)
    error = '데이터를 불러오는데 실패했습니다.'
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">대시보드</h2>
        <p className="text-muted-foreground">
          쇼핑몰 운영 현황을 한눈에 확인하세요
        </p>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-lg">
          <p className="font-semibold mb-2">오류가 발생했습니다</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 opacity-75">
            데이터베이스 연결을 확인해주세요. (DATABASE_URL 환경변수 설정 필요)
          </p>
        </div>
      ) : (
        <>
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">전체 상품</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">전체 주문</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">전체 고객</p>
              <p className="text-3xl font-bold">{stats.totalCustomers}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">총 매출</p>
              <p className="text-3xl font-bold">{formatPrice(stats.totalRevenue)}</p>
            </Card>
          </div>

          {/* 최근 주문 */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">최근 주문</h3>
            {recentOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                주문이 없습니다.
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-semibold">주문 #{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user.name} ({order.user.email})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
