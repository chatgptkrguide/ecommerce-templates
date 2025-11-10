# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **basic e-commerce storefront implementation** built with modern web technologies. The repository contains a fully functional shopping mall system with product management, shopping cart, order processing, and admin dashboard.

**Current Status**: Development Phase - Core implementation in progress.

## Project Architecture

The repository is a single Next.js application organized as follows:

```
ecommerce-templates/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (storefront)/       # Customer-facing pages
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── orders/
│   │   ├── (admin)/            # Admin dashboard
│   │   │   └── dashboard/
│   │   └── api/                # API routes
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utilities and configurations
│   └── types/                  # TypeScript type definitions
├── prisma/                     # Database schema and migrations
├── public/                     # Static assets
└── [config files]              # Next.js, TypeScript, Tailwind configs
```

## Tech Stack (As Specified)

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand, React Query (TanStack Query)
- **Forms**: React Hook Form, Zod validation
- **Image Handling**: next/image, Cloudinary
- **SEO**: next-seo, react-helmet

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes / Express
- **Database**: PostgreSQL (Supabase), Prisma ORM
- **Search**: Elasticsearch / Algolia
- **Cache**: Redis
- **Storage**: AWS S3 / Cloudinary
- **Queue**: Bull, BullMQ

### Infrastructure
- **Hosting**: Vercel / AWS
- **CDN**: Cloudflare, CloudFront
- **Monitoring**: Sentry, Datadog
- **Analytics**: Google Analytics 4, Mixpanel

## Key Implementation Requirements

### Core Features (Per README Specification)

1. **Product Management System**
   - Multi-image uploads, product options, hierarchical categories
   - Real-time inventory tracking with automatic notifications
   - SEO optimization with structured data

2. **Shopping Features**
   - Full-text search with Elasticsearch/Algolia
   - Shopping cart (persistent for logged-in/guest users)
   - Wishlist functionality

3. **Order & Payment Processing**
   - Multi-address management
   - PG integration (Stripe, Toss Payments)
   - Order tracking with status updates
   - Cancel/exchange/refund workflows

4. **Review System**
   - Star ratings, media uploads (images/videos)
   - Verified purchase reviews
   - Seller responses

5. **Promotions & Marketing**
   - Coupon system (fixed/percentage discounts)
   - Points/rewards system
   - Time-limited sales, bundle deals

6. **Admin Dashboard**
   - Sales management and analytics
   - Product/inventory/customer management
   - Revenue statistics and traffic analysis

### Security Requirements

- User authentication with role-based access control
- SQL injection prevention (Prisma ORM)
- XSS and CSRF protection
- Payment information encryption
- GDPR compliance for personal data
- Server-side order amount validation
- Rate limiting

### Performance Optimization

- Image optimization: next/image, WebP format, CDN delivery
- Code splitting: Dynamic imports, route-based splitting
- Caching strategy: Redis, ISR (Incremental Static Regeneration)
- Database optimization: Indexing, connection pooling

## Development Workflow

### Initial Setup

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Setup database
npx prisma migrate dev
npx prisma db seed  # Insert sample data

# Start development server
npm run dev
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Load testing
npm run test:load
```

## Critical Environment Variables

Each template requires:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` and `NEXTAUTH_SECRET` - Authentication
- `STRIPE_SECRET_KEY` or `TOSS_SECRET_KEY` - Payment processing
- `CLOUDINARY_*` - Image storage and CDN
- `ALGOLIA_*` - Product search functionality
- `RESEND_API_KEY` - Email notifications
- `NEXT_PUBLIC_GA_ID` - Analytics tracking
- `REDIS_URL` - Caching layer

## Integration Points

This repository can be extended with additional features:

- **Authentication**: NextAuth.js for user authentication
- **Payment Processing**: Stripe or Toss Payments integration
- **Admin Dashboard**: Enhanced admin panel features
- **Social Features**: Social shopping and sharing capabilities
- **AI Recommendations**: Product recommendation systems

## Key Business Flows

### Customer Purchase Flow
1. Product browsing (category/search)
2. Product detail review
3. Add to cart
4. Checkout (shipping address, payment method)
5. Payment processing
6. Order confirmation
7. Shipping tracking
8. Delivery completion
9. Purchase confirmation
10. Review submission (optional)

### Seller Order Management Flow
1. New order notification
2. Order and payment verification
3. Product preparation
4. Shipping processing (courier integration)
5. Tracking number registration
6. Delivery completion
7. Purchase confirmation wait
8. Settlement

## Legal Compliance (Korea)

Before production deployment, ensure:
- Electronic Commerce Law compliance
- Business registration certificate
- Mail-order sales business registration
- Privacy policy documentation
- Terms of service
- Refund/exchange policy
- Customer service setup
- PG company integration and approval
- Courier service integration
- SSL certificate installation

## Implementation Notes

When implementing templates:

1. **Follow Next.js 14 App Router patterns** - Use server components by default, client components when needed
2. **Use Prisma transactions** for order processing to ensure data consistency
3. **Implement server-side validation** for all payment and order amounts
4. **Use Zustand with persist middleware** for cart state management
5. **Leverage React Query** for server state management and caching
6. **Apply proper TypeScript types** using Zod schemas for validation
7. **Optimize images** using next/image with appropriate priority settings
8. **Implement proper error boundaries** for graceful error handling
9. **Use ISR or SSG** where appropriate for better performance
10. **Follow Korean e-commerce UX patterns** - price display with "원", shipping fee transparency

## Additional Context

- **Language**: Primary documentation and UI should support Korean
- **Currency**: Korean Won (₩) as primary currency
- **Purpose**: Educational and prototype development - not production-ready without legal/security review
- **License**: MIT - free to use, modify, and distribute
