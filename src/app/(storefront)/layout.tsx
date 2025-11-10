import Link from 'next/link'
import { ShoppingCart, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold">
              🛒 Basic Store
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="상품 검색..."
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/auth/signin">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-6 h-12 items-center text-sm">
            <Link href="/products" className="hover:text-primary transition">
              전체상품
            </Link>
            <Link href="/products?category=electronics" className="hover:text-primary transition">
              전자제품
            </Link>
            <Link href="/products?category=fashion" className="hover:text-primary transition">
              패션
            </Link>
            <Link href="/products?category=home-and-living" className="hover:text-primary transition">
              홈&리빙
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-12 bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">고객센터</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>공지사항</li>
                <li>자주 묻는 질문</li>
                <li>1:1 문의</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">쇼핑 정보</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>주문/배송 조회</li>
                <li>취소/교환/반품</li>
                <li>결제 수단 안내</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">회사 정보</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>회사 소개</li>
                <li>이용약관</li>
                <li>개인정보 처리방침</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <p className="text-sm text-muted-foreground">
                소셜 미디어에서 최신 소식을 만나보세요
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Basic Storefront. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
