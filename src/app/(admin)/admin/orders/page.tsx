import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default async function AdminOrdersPage() {
  let orders = []
  let error = null

  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
      take: 50,
    })
  } catch (e) {
    console.error('Orders error:', e)
    error = '주문 목록을 불러오는데 실패했습니다.'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700'
      case 'COMPLETED':
        return 'bg-green-100 text-green-700'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '대기중'
      case 'PROCESSING':
        return '처리중'
      case 'SHIPPED':
        return '배송중'
      case 'COMPLETED':
        return '완료'
      case 'CANCELLED':
        return '취소'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">주문 관리</h2>
          <p className="text-muted-foreground">전체 {orders.length}개의 주문</p>
        </div>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-lg">
          <p className="font-semibold mb-2">오류가 발생했습니다</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 opacity-75">
            데이터베이스 연결을 확인해주세요.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">주문이 없습니다</h3>
          <p className="text-muted-foreground">
            아직 접수된 주문이 없습니다.
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">주문번호</th>
                  <th className="text-left p-4 font-semibold">고객</th>
                  <th className="text-left p-4 font-semibold">상품</th>
                  <th className="text-left p-4 font-semibold">주문일시</th>
                  <th className="text-left p-4 font-semibold">금액</th>
                  <th className="text-left p-4 font-semibold">상태</th>
                  <th className="text-right p-4 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-semibold">#{order.orderNumber}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{order.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user.email}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">
                        {order.items.length}개 상품
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items[0]?.product.name}
                        {order.items.length > 1 && ` 외 ${order.items.length - 1}개`}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">
                        {format(new Date(order.createdAt), 'yyyy-MM-dd', {
                          locale: ko,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.createdAt), 'HH:mm', {
                          locale: ko,
                        })}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          상세
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
