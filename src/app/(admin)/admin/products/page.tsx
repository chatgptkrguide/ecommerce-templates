import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

export default async function AdminProductsPage() {
  let products = []
  let error = null

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        category: {
          select: { name: true },
        },
      },
      take: 50,
    })
  } catch (e) {
    console.error('Products error:', e)
    error = '상품 목록을 불러오는데 실패했습니다.'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">상품 관리</h2>
          <p className="text-muted-foreground">
            전체 {products.length}개의 상품
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 상품 추가
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-lg">
          <p className="font-semibold mb-2">오류가 발생했습니다</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 opacity-75">
            데이터베이스 연결을 확인해주세요.
          </p>
        </div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">상품이 없습니다</h3>
          <p className="text-muted-foreground mb-6">
            첫 번째 상품을 추가해보세요!
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            또는 샘플 데이터를 추가하려면:
          </p>
          <code className="bg-gray-100 px-4 py-2 rounded text-sm">
            npm run db:seed
          </code>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">상품</th>
                  <th className="text-left p-4 font-semibold">카테고리</th>
                  <th className="text-left p-4 font-semibold">가격</th>
                  <th className="text-left p-4 font-semibold">재고</th>
                  <th className="text-left p-4 font-semibold">상태</th>
                  <th className="text-right p-4 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{product.category.name}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{formatPrice(product.price)}</p>
                      {product.compareAtPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.compareAtPrice)}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-sm ${
                          product.stock > 10
                            ? 'text-green-600'
                            : product.stock > 0
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {product.stock}개
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {product.status === 'ACTIVE' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4 text-destructive" />
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
