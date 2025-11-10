import { prisma } from '@/lib/db/prisma'
import { ProductCard } from '@/components/products/product-card'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string }
}) {
  const products = await prisma.product.findMany({
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

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">전체 상품</h1>

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
            <p className="text-center text-muted-foreground py-12">
              상품이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
