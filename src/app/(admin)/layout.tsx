import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">관리자</h2>
          <p className="text-sm text-gray-400">Admin Dashboard</p>
        </div>

        <nav className="px-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>대시보드</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Package className="h-5 w-5" />
            <span>상품 관리</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>주문 관리</span>
          </Link>

          <Link
            href="/admin/customers"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Users className="h-5 w-5" />
            <span>고객 관리</span>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Settings className="h-5 w-5" />
            <span>설정</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← 쇼핑몰로 돌아가기
          </Link>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 bg-gray-50">
        <div className="border-b bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">관리자 대시보드</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                관리자님 환영합니다
              </span>
            </div>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
