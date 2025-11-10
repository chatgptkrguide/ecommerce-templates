import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number | null
    images: { url: string; alt: string | null }[]
    category: { name: string }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0]
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {mainImage && (
            <Image
              src={mainImage.url}
              alt={mainImage.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {discount && (
            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-sm font-semibold">
              -{discount}%
            </div>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault()
              // TODO: 위시리스트 추가 로직
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  )
}
