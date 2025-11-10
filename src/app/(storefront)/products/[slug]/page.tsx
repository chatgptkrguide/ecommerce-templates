import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    select: { slug: true },
    take: 50,
  })

  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, status: 'ACTIVE' },
    include: {
      images: { orderBy: { order: 'asc' } },
      category: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!product) {
    notFound()
  }

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* 이미지 갤러리 */}
        <div>
          {product.images[0] && (
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(1, 5).map((image) => (
              <div
                key={image.id}
                className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden"
              >
                <Image
                  src={image.url}
                  alt={image.alt || product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 상품 정보 */}
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            {product.category.name}
          </div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* 평점 */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews.length} 리뷰)
            </span>
          </div>

          {/* 가격 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {discount && (
                <span className="text-2xl font-bold text-destructive">
                  {discount}%
                </span>
              )}
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.compareAtPrice && (
              <div className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </div>
            )}
          </div>

          {/* 재고 */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600">재고 있음 ({product.stock}개)</span>
            ) : (
              <span className="text-destructive">품절</span>
            )}
          </div>

          {/* 구매 버튼 */}
          <div className="flex gap-3 mb-8">
            <Button size="lg" className="flex-1" disabled={product.stock === 0}>
              장바구니 담기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              disabled={product.stock === 0}
            >
              바로 구매
            </Button>
          </div>

          {/* 상품 설명 */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">상품 상세</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {product.description}
            </p>
          </Card>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      {product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">고객 리뷰</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{review.user.name}</div>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                {review.title && (
                  <h3 className="font-semibold mb-2">{review.title}</h3>
                )}
                <p className="text-sm">{review.content}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
