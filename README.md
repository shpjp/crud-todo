# 📝 Todo-fier

A modern task management app with secure authentication and real-time filtering.

## 🚀 Tech Stack

**Frontend**: Next.js 16 (App Router) • TypeScript • Tailwind CSS • shadcn/ui  
**Backend**: Prisma • MongoDB • JWT Authentication • bcrypt  
**Runtime**: Node.js / Bun

## ✨ Features

- 🔐 Secure JWT authentication with httpOnly cookies
- ✅ Full CRUD operations for tasks
- 🎯 Priority levels (High, Medium, Low) & status tracking
- 📂 Categories: Personal & Work
- 🔍 Real-time search & filtering
- 📊 Overview panel with statistics
- 📱 Responsive design

## � Security

- Bcrypt password hashing (12 rounds)
- JWT tokens in httpOnly cookies
- API route protection & user ownership verification
- Edge-safe middleware for route guards

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install
# or
bun install

# 2. Create .env file
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/todo-fier"
JWT_SECRET="your-secret-key-min-32-chars"

# 3. Setup database
npm run prisma:generate
npm run prisma:push

# 4. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run prisma:generate   # Generate Prisma Client
npm run prisma:push       # Push schema to DB
npm run prisma:studio     # Open Prisma Studio
```

## 🎨 UI/UX Features

### Layout
- **Header**: App title, Add Task button, Logout button
- **Main Content**: 3-column grid (Ongoing, Completed, Overdue)
- **Footer**: Copyright and branding

### Task Card Components
- Title with strikethrough for completed tasks
- Color-coded priority badges (RED: High, YELLOW: Medium, GREEN: Low)
- Truncated descriptions (100 characters)
- Formatted due dates
- Quick action buttons (Complete/Undo, Edit, Delete)

### UX Enhancements
- Loading indicators during async operations
- Disabled buttons during actions
- Optimistic UI updates
- Clear error and success feedback
- Empty state messages
- Confirmation dialogs for destructive actions
- Responsive design (mobile-friendly)

### Performance Optimizations
- `React.memo` for task cards (prevents unnecessary re-renders)
- `useMemo` for derived lists (ongoing, completed, overdue)
- `useCallback` for stable event handlers
- Single source of truth for task state
- Minimal API payloads

## 🏗️ Architecture Decisions

### Middleware Design
**Problem**: Prisma cannot run in Edge runtime  
**Solution**: Middleware only checks cookie presence; JWT verification happens in API routes (Node.js runtime)
📦 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT (min 32 chars) |

## 🚀 Deploy

**Vercel (Recommended)**
1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

**Build Command**: `prisma generate && next build`

---

Built with ❤️ using Next.js & MongoDB