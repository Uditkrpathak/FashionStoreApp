# SRS — Fashion E-Commerce App (React Native)
Reference: Behance "Clothing Store App/Fashion E-Commerce App | App UI Kit" (gallery/178392283)

---

## 1. Scope

Mobile shopping app (iOS + Android, single React Native codebase) for browsing, purchasing, and tracking fashion products. Backend is a microservices system on the MERN stack. Frontend state managed with Redux Toolkit (global/server state) + Context API (local/UI state).

---

## 2. Screens (40+)

### 2.1 Onboarding & Auth
| # | Screen | Notes |
|---|--------|-------|
| 1 | Splash | Logo, auto-navigates after auth check |
| 2 | Welcome / Onboarding (3 slides) | Swipeable intro carousel |
| 3 | Sign In | Email/phone + password |
| 4 | Create Account | Name, email, phone, password |
| 5 | Verify Code (OTP) | 4–6 digit input |
| 6 | Forgot Password | Email/phone entry |
| 7 | New Password | Reset form |
| 8 | Continue Your Profile | Avatar, DOB, gender (optional step) |
| 9 | Location Access (permission) | System-style prompt |
| 10 | Enter Your Location / Pick on Map | Manual/GPS |

### 2.2 Core Shopping
| # | Screen | Notes |
|---|--------|-------|
| 11 | Home | Banners, categories, featured, new arrivals |
| 12 | Search | Recent searches, trending, autocomplete |
| 13 | Search Results | Grid/list toggle |
| 14 | Filter | Price, size, color, brand, rating |
| 15 | Sort | Popularity, price, newest |
| 16 | Category Listing | All categories grid |
| 17 | Sub-category / Product Listing | Paginated grid |
| 18 | Product Details | Images carousel, size/color selector, reviews summary |
| 19 | Product Image Zoom/Gallery | Full-screen swipe |
| 20 | Size Guide | Modal/bottom sheet |
| 21 | Reviews & Ratings List | Filter by rating |
| 22 | Write a Review | Star input + text + photo upload |
| 23 | Similar / Recommended Products | Horizontal carousel section |

### 2.3 Wishlist / Cart / Checkout
| # | Screen | Notes |
|---|--------|-------|
| 24 | Wishlist | Grid of saved items |
| 25 | My Cart | Line items, qty stepper, remove/save-for-later |
| 26 | Promo Code / Apply Coupon | Input + validation |
| 27 | Checkout — Shipping Address | Address list + add new |
| 28 | Add/Edit Address | Form + map pin |
| 29 | Checkout — Delivery Options | Standard/express |
| 30 | Checkout — Payment Method | Card / UPI / wallet / COD |
| 31 | Add Card | Card form |
| 32 | Order Summary / Review Order | Final confirm |
| 33 | Order Success / Confirmation | Animation + order ID |

### 2.4 Orders & Account
| # | Screen | Notes |
|---|--------|-------|
| 34 | My Orders (list) | Tabs: Active / Completed / Cancelled |
| 35 | Order Details | Item list, invoice |
| 36 | Track Order | Status timeline / map |
| 37 | Cancel / Return / Refund | Reason form |
| 38 | Profile / Account Home | Menu list |
| 39 | Edit Profile | Avatar, name, email, phone |
| 40 | My Addresses | List, add/edit/delete |
| 41 | Saved Cards / Payment Methods | List, add/delete |
| 42 | Notifications | Push/order/promo list |
| 43 | Notification Settings | Toggles |
| 44 | Help & Support / FAQ | Accordion list |
| 45 | Chat/Contact Support | Chat UI (optional) |
| 46 | About / Terms / Privacy Policy | Static content |
| 47 | Settings | Language, theme, logout |
| 48 | Empty States (cart/wishlist/orders/search) | Reusable component, not a route |

### 2.5 Misc
| # | Screen | Notes |
|---|--------|-------|
| 49 | No Internet | Reusable overlay |
| 50 | Error / 404 | Reusable |

---

## 3. Color Palette (starting point — verify against source file)

```
Primary (Brand/CTA):    #1A1A2E   (near-black navy — buttons, active tab)
Primary Accent:         #FF6B6B   (coral/red — sale badges, wishlist heart)
Secondary Accent:       #FFB600   (gold/amber — ratings, highlights)
Background:             #FFFFFF
Surface / Card:         #F7F7FA
Text Primary:           #1A1A1A
Text Secondary:         #7C7C8A
Border/Divider:         #ECECEC
Success:                #2ECC71
Error:                  #EB5757
Disabled:               #C4C4CC
Dark mode BG (if used): #121212
```
Store as a single `theme/colors.ts` (or `.js`) constants file — do not hardcode hex anywhere in components.

---

## 4. Navigation Architecture (React Navigation v6+)

```
RootNavigator (Stack)
├── AuthStack (Stack) — shown if no token
│   Splash → Onboarding → SignIn → CreateAccount → VerifyOTP
│   → ForgotPassword → NewPassword → ContinueProfile → LocationAccess
│
└── AppStack (Stack) — shown if authenticated
    ├── BottomTabNavigator
    │   ├── HomeStack (Home → CategoryListing → ProductListing → ProductDetails
    │   │              → SizeGuide → Reviews → WriteReview)
    │   ├── SearchStack (Search → SearchResults → Filter → Sort)
    │   ├── WishlistStack (Wishlist → ProductDetails)
    │   ├── CartStack (Cart → PromoCode)
    │   └── ProfileStack (ProfileHome → EditProfile → Addresses → SavedCards
    │                     → Notifications → Settings → Help → About)
    │
    └── Modal/Global Stack (accessible from any tab)
        Checkout(Address → Delivery → Payment → AddCard → OrderReview)
        → OrderSuccess
        MyOrders → OrderDetails → TrackOrder → CancelReturn
```
- Bottom tabs: Home, Search, Wishlist, Cart (badge count), Profile.
- Checkout and Orders live in a separate stack pushed modally over tabs so tab bar hides during checkout.
- Deep linking: `app://product/:id`, `app://order/:id` for push notification taps.

---

## 5. State Management Split

**Redux Toolkit (global, server-derived, cross-screen state):**
- `authSlice` — user, token, login state
- `cartSlice` — cart items, totals (optimistic updates, synced to server)
- `wishlistSlice`
- `productSlice` / RTK Query API slices for product catalog, search, orders
- `checkoutSlice` — selected address/payment/delivery through the flow

Use **RTK Query** for all server data fetching (products, orders, reviews) — gives you caching, invalidation, loading/error states for free instead of hand-rolled thunks.

**Context API (local, UI-only, doesn't need Redux devtools/persistence):**
- `ThemeContext` — light/dark mode
- `ToastContext` / `SnackbarContext`
- `BottomSheetContext` (size guide, filters, sort — shared modal controller)
- `NetworkContext` (online/offline banner)

Rule of thumb: if it's fetched from or synced to the backend, or read by 3+ unrelated screens → Redux. If it's purely presentational/session-local → Context.

---

## 6. Frontend Folder Structure

```
src/
├── api/                 # RTK Query API slices (authApi, productApi, orderApi...)
├── app/                 # store.ts, rootReducer
├── components/          # shared, dumb, reusable components
├── constants/           # colors.ts, typography.ts, spacing.ts
├── context/             # ThemeContext, ToastContext, etc.
├── features/            # feature-sliced: auth/, cart/, wishlist/, product/, order/
│   └── cart/
│       ├── cartSlice.ts
│       ├── CartScreen.tsx
│       └── components/
├── navigation/           # AuthStack, AppStack, TabNavigator, linking config
├── hooks/                # useDebounce, useAppSelector/useAppDispatch, etc.
├── utils/                # formatters, validators
└── assets/
```

---

## 7. Backend — Microservices Architecture

```
                         ┌─────────────────┐
                         │   API Gateway    │  (Express/NGINX — auth check, routing, rate limit)
                         └────────┬─────────┘
     ┌───────────┬────────────────┼────────────────┬─────────────┬─────────────┐
     ▼           ▼                ▼                ▼             ▼             ▼
 Auth Svc   User Svc      Product/Catalog Svc   Cart Svc     Order Svc    Payment Svc
     │           │                │                │             │             │
     ▼           ▼                ▼                ▼             ▼             ▼
  MongoDB     MongoDB          MongoDB          Redis/Mongo    MongoDB      (Razorpay/Stripe)
                                                                             + txn log DB

        Also: Wishlist Svc, Review Svc, Notification Svc (push/email/SMS, queue-driven)
```

**Communication:**
- Sync: REST between Gateway ↔ services (or gRPC if you want lower latency internally).
- Async: RabbitMQ/Kafka for events — `order.placed` → triggers Notification Svc + Payment Svc + inventory decrement in Product Svc. Decouples services so Order Svc doesn't block on email/SMS sending.

**Per-service responsibility:**
- **Auth Service** — signup/login, JWT issue+refresh, OTP verification, password reset. Owns `users.auth` collection (credentials only).
- **User Service** — profile, addresses, saved cards (tokenized refs only, never raw card data).
- **Product/Catalog Service** — products, categories, variants (size/color/stock), search (consider Elasticsearch if catalog is large).
- **Cart Service** — cart CRUD, price recalculation, coupon validation. Redis for cart session speed, persisted to Mongo periodically.
- **Order Service** — order creation, state machine (placed → confirmed → shipped → delivered/cancelled), order history.
- **Payment Service** — payment intent creation, webhook handling (Razorpay/Stripe), refunds.
- **Wishlist Service** — simple CRUD, can be folded into User Service if you want to cut scope.
- **Review Service** — product reviews/ratings, moderation flag.
- **Notification Service** — consumes events, sends push (FCM)/email/SMS.

**Shared infra:**
- API Gateway does JWT verification once, forwards user context via headers (`x-user-id`) so downstream services don't re-verify.
- Each service: own MongoDB database (database-per-service — don't share collections across services).
- Docker Compose for local dev, each service containerized independently; docker network for inter-service calls.
- Centralized logging (e.g., ELK or just structured JSON logs to stdout + a log aggregator) since debugging across services is harder than a monolith.

**Note:** given your usual preference for a well-scoped monolith, microservices here is real overhead (service discovery, distributed tracing, eventual consistency on cart/order/inventory). Worth it only if you're doing this for the system-design learning value or expect to scale services independently. If it's a portfolio piece, a "modular monolith" (same folder-per-domain structure, single deployable) gets you 90% of the interview value with far less DevOps tax — your call.

---

## 8. Core Data Models (Mongoose, abbreviated)

```js
// User (Auth Svc)
{ _id, email, phone, passwordHash, role, isVerified, createdAt }

// Profile (User Svc)
{ userId, name, avatar, dob, gender, addresses: [{ label, line1, city, pincode, geo }] }

// Product (Catalog Svc)
{ _id, title, brand, category, subCategory, description, images: [],
  variants: [{ size, color, sku, stock, price, mrp }], rating, reviewCount, tags: [] }

// Cart (Cart Svc)
{ userId, items: [{ productId, variantSku, qty, priceAtAdd }], couponCode, updatedAt }

// Order (Order Svc)
{ _id, userId, items: [...], shippingAddress, paymentStatus, orderStatus,
  statusHistory: [{ status, timestamp }], totals: { subtotal, discount, shipping, tax, grandTotal } }

// Payment (Payment Svc)
{ orderId, gateway, gatewayTxnId, amount, status, refunds: [] }
```

---

## 9. Non-Functional Requirements

- Auth: JWT access token (short-lived) + refresh token (httpOnly-equivalent secure storage via Keychain/Keystore, not AsyncStorage, for tokens).
- Image handling: Cloudinary for product images, lazy-load + placeholder blur in lists.
- Performance: FlashList (not FlatList) for product grids at scale; RTK Query cache to avoid refetch storms.
- Offline: cache last-loaded home/catalog via RTK Query's persisted cache or redux-persist for cart.
- Security: never store raw card data (use gateway tokenization), rate-limit OTP endpoints, validate all inputs server-side per service.
- Observability: request-id propagation across services for tracing a single checkout flow through Gateway → Cart → Order → Payment.

---

## 10. Suggested Build Order

1. Design system: colors, typography, spacing, shared components (Button, Input, Card, BottomSheet).
2. Navigation skeleton (all stacks wired with placeholder screens).
3. Auth flow end-to-end (Auth Svc + Gateway + screens).
4. Catalog: Home, Listing, Product Details (read-only, static/mock data first).
5. Cart + Wishlist (Redux slices + Cart Svc).
6. Checkout + Order + Payment Svc integration.
7. Profile, Orders history, Notifications.
8. Polish: empty states, error states, loading skeletons, animations.