import { prisma } from '@/lib/db/prisma'
import { ProductCard } from '@/components/products/product-card'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string }
}) {
  let products = []
  let categories = []
  let error = null

  try {
    const productQuery = prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        ...(searchParams.category && {
          category: { slug: searchParams.category },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        category: {
          select: { name: true, slug: true },
        },
      },
      take: 12,
    })

    const categoryQuery = prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    })

    ;[products, categories] = await Promise.all([productQuery, categoryQuery])
  } catch (e) {
    console.error('Database error:', e)
    error = '데이터베이스 연결 오류가 발생했습니다.'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">전체 상품</h1>

      {error ? (
        <div className="text-center py-12">
          <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-lg inline-block">
            <p className="font-semibold mb-2">오류가 발생했습니다</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2 text-muted-foreground">
              데이터베이스 연결을 확인해주세요. (DATABASE_URL 환경변수 설정 필요)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-8">
          {/* 사이드바 */}
          <aside className="w-64 shrink-0">
            <h2 className="font-semibold mb-4">카테고리</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/products"
                  className="block py-2 hover:text-primary transition"
                >
                  전체
                </a>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`/products?category=${category.slug}`}
                    className="block py-2 hover:text-primary transition"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* 상품 그리드 */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground mb-2">상품이 없습니다.</p>
                <p className="text-sm text-muted-foreground">
                  데이터베이스에 상품을 추가하려면: npm run db:seed
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
