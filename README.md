# Todo-fier

A production-quality CRUD Todo / Task Management application built with Next.js App Router, Prisma, MongoDB, and custom JWT authentication.

## 🎯 Project Overview

Todo-fier is a full-stack task management application that demonstrates clean architecture, secure authentication, and scalable design patterns. The application prioritizes correctness, security, and user experience while maintaining interview-ready code quality.

## 🧱 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Package Manager**: Bun (fast all-in-one JavaScript runtime)
- **Database**: MongoDB
- **ORM**: Prisma (MongoDB connector)
- **Authentication**: Custom JWT (manual implementation)
- **Password Hashing**: bcrypt (12 salt rounds)
- **Styling**: Tailwind CSS
- **Runtime**: Node.js / Bun

## ✨ Features

### Authentication
- ✅ Secure user signup with email validation
- ✅ Login with credential verification
- ✅ JWT-based authentication (7-day expiry)
- ✅ httpOnly cookies for token storage
- ✅ Secure logout functionality

### Task Management (Full CRUD)
- ✅ Create tasks with title, description, priority, and due date
- ✅ Read all user tasks
- ✅ Update task details and completion status
- ✅ Delete tasks
- ✅ Task organization into three categories:
  - **Ongoing**: Active tasks
  - **Completed**: Finished tasks
  - **Overdue**: Tasks past their due date (computed dynamically)

### Task Features
- Priority levels: LOW, MEDIUM, HIGH
- Optional due dates
- Optional descriptions
- Automatic sorting by priority, due date, and creation time
- Visual priority badges with color coding
- Quick actions (complete, edit, delete)

## 📁 Project Structure

```
todo-fier/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts    # User registration
│   │   │   ├── login/route.ts     # User authentication
│   │   │   └── logout/route.ts    # Session termination
│   │   └── tasks/
│   │       └── route.ts           # CRUD operations (GET, POST, PATCH, DELETE)
│   ├── dashboard/
│   │   └── page.tsx               # Main task management interface
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── signup/
│   │   └── page.tsx               # Registration page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Root page (redirects to dashboard)
│   └── globals.css                # Global styles
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── jwt.ts                     # JWT generation and verification
│   └── auth.ts                    # Authentication helpers
├── prisma/
│   └── schema.prisma              # Database schema
├── middleware.ts                  # Edge-safe route protection
├── .env.example                   # Environment variables template
└── package.json
```

## 🗄️ Database Design

### User Model
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String   // bcrypt hashed
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Task Model
```prisma
model Task {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  userId      String    @db.ObjectId
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Design Principles
- No derived states stored (e.g., `overdue` is computed: `!completed && dueDate < now`)
- Cascade deletion: User deletion removes all their tasks
- Indexed userId for query performance

## 🔐 Security Features

### Authentication
- ✅ Passwords hashed with bcrypt (12 salt rounds)
- ✅ JWT tokens stored in httpOnly cookies
- ✅ Secure flag enabled in production
- ✅ 7-day token expiration
- ✅ Email validation and uniqueness enforcement

### Authorization
- ✅ Ownership enforcement at API level
- ✅ Users can only access their own tasks
- ✅ Client-sent IDs never trusted without verification
- ✅ Proper HTTP status codes (401, 403, 404, etc.)

### Edge-Safe Middleware
- ✅ Only checks cookie presence (no JWT verification)
- ✅ No Prisma imports (Edge runtime compatible)
- ✅ Redirects unauthenticated users to login
- ✅ Redirects authenticated users away from auth pages

### API Security
- ✅ All Prisma routes use Node.js runtime (`export const runtime = "nodejs"`)
- ✅ JWT verification in API routes only
- ✅ No sensitive data in error responses
- ✅ Input validation on all endpoints
- ✅ Environment-based JWT secrets

## 🚀 Setup Instructions

### Prerequisites
- Bun 1.0+ installed (includes Node.js runtime)
- MongoDB database (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   cd todo-fier
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/todo-fier?retryWrites=true&w=majority"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

   **⚠️ Important**: 
   - Replace `username`, `password`, and `cluster` with your MongoDB credentials
   - Generate a strong random string for `JWT_SECRET` (use: `openssl rand -base64 32`)

4. **Generate Prisma client**
   ```bash
   bun prisma generate
   ```

5. **Push database schema**
   ```bash
   bun prisma db push
   ```

6. **Run the development server**
   ```bash
   bun dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🛠️ Available Scripts

```bash
# Development
bun dev              # Start development server

# Production
bun run build        # Build for production
bun start            # Start production server

# Database
bun prisma generate  # Generate Prisma client
bun prisma db push   # Push schema to database
bun prisma studio    # Open Prisma Studio (GUI)

# Linting
bun run lint         # Run ESLint
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

### Authentication Flow
1. User submits credentials
2. API route verifies with database
3. JWT generated and stored in httpOnly cookie
4. Subsequent requests include cookie automatically
5. API routes verify JWT and authorize actions

### Task Organization
**No stored categories**: The "overdue" status is computed on-the-fly based on:
```typescript
!task.completed && task.dueDate && new Date(task.dueDate) < new Date()
```

This ensures data accuracy without manual updates.

### Error Handling
- Generic error messages to clients (no stack traces)
- Detailed logging on server for debugging
- Consistent JSON error format: `{ error: "message" }`
- Proper HTTP status codes for different error types

## 📊 API Endpoints

### Authentication

#### `POST /api/auth/signup`
Create a new user account
```json
// Request
{
  "email": "user@example.com",
  "password": "securepassword"
}

// Response (201)
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "email": "user@example.com"
  }
}
```

#### `POST /api/auth/login`
Authenticate user
```json
// Request
{
  "email": "user@example.com",
  "password": "securepassword"
}

// Response (200)
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "user@example.com"
  }
}
```

#### `POST /api/auth/logout`
Clear authentication cookie
```json
// Response (200)
{
  "message": "Logged out successfully"
}
```

### Tasks

#### `GET /api/tasks`
Fetch all tasks for authenticated user
```json
// Response (200)
{
  "tasks": [
    {
      "id": "...",
      "title": "Complete project",
      "description": "Finish the Todo app",
      "completed": false,
      "priority": "HIGH",
      "dueDate": "2026-01-20T00:00:00.000Z",
      "createdAt": "2026-01-17T10:00:00.000Z",
      "updatedAt": "2026-01-17T10:00:00.000Z"
    }
  ]
}
```

#### `POST /api/tasks`
Create a new task
```json
// Request
{
  "title": "New task",
  "description": "Optional description",
  "priority": "MEDIUM",
  "dueDate": "2026-01-25T00:00:00.000Z"
}

// Response (201)
{
  "task": { /* task object */ }
}
```

#### `PATCH /api/tasks`
Update an existing task
```json
// Request
{
  "id": "task_id",
  "title": "Updated title",
  "completed": true
}

// Response (200)
{
  "task": { /* updated task object */ }
}
```

#### `DELETE /api/tasks?id={taskId}`
Delete a task
```json
// Response (200)
{
  "message": "Task deleted successfully"
}
```

## 🧪 Testing the Application

### Manual Testing Workflow

1. **Sign Up**
   - Navigate to `/signup`
   - Create an account with valid email and password (min 6 characters)
   - Verify automatic redirect to dashboard

2. **Create Tasks**
   - Click "Add Task" button
   - Fill in task details (title required)
   - Set priority and due date
   - Verify task appears in "Ongoing" column

3. **Task Operations**
   - **Complete**: Click "Complete" button → task moves to "Completed" column
   - **Edit**: Click "Edit" button → modify task details → save
   - **Delete**: Click "Delete" button → confirm → task removed
   - **Undo**: Click "Undo" on completed task → moves back to "Ongoing"

4. **Overdue Tasks**
   - Create a task with past due date
   - Verify it appears in "Overdue" column
   - Complete it → moves to "Completed" column

5. **Logout and Security**
   - Click "Logout"
   - Verify redirect to login page
   - Try accessing `/dashboard` directly → redirected to login
   - Log in again → access restored

## 🚨 Common Issues and Solutions

### Issue: Prisma Client Not Generated
```bash
# Solution
bun prisma generate
```

### Issue: Database Connection Error
- Verify `DATABASE_URL` in `.env` is correct
- Check MongoDB cluster is running
- Ensure IP address is whitelisted in MongoDB Atlas

### Issue: JWT Secret Error
- Ensure `JWT_SECRET` is set in `.env`
- Use a strong, random string (at least 32 characters)

### Issue: Port Already in Use
```bash
# Change port
PORT=3001 bun dev
```

## 🎓 Interview Talking Points

### System Design
- **Separation of Concerns**: Middleware (cookie check) vs API routes (JWT verification + DB)
- **Edge Runtime Constraints**: Understanding when to use Node.js runtime
- **Security Best Practices**: httpOnly cookies, bcrypt, JWT expiration, ownership enforcement

### Architecture Patterns
- **Single Responsibility**: Each file/function has one clear purpose
- **DRY Principle**: Reusable utility functions (jwt.ts, auth.ts)
- **Error Handling**: Consistent, user-friendly, secure

### Performance
- **React Optimizations**: memo, useMemo, useCallback for preventing re-renders
- **Database Efficiency**: Indexed queries, minimal payloads, cascade deletes
- **Client-Side State**: Single source of truth, derived computations

### Scalability Considerations
- **Database Indexing**: userId indexed for fast queries
- **Stateless Authentication**: JWT allows horizontal scaling
- **API Design**: RESTful endpoints, proper HTTP methods
- **Type Safety**: TypeScript for compile-time error prevention

### What Could Be Added (Out of Scope)
- Rate limiting (prevent brute force attacks)
- Refresh tokens (for longer sessions)
- Email verification (confirm user email)
- Password reset flow
- Task sharing/collaboration
- Real-time updates (WebSockets)
- Task attachments/files
- Task comments/history
- Search and filtering
- Pagination for large task lists

## 📝 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/todo-fier` |
| `JWT_SECRET` | Secret key for JWT signing | Yes | `your-super-secret-key-min-32-chars` |

## 🤝 Contributing

This is a demonstration project for educational purposes. While contributions are welcome, the primary goal is to showcase clean architecture and best practices.

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Built as a production-quality demonstration of full-stack development skills.

---

**Remember**: This project demonstrates that simplicity, correctness, and security are more valuable than unnecessary complexity. Every decision was made with clarity and maintainability in mind.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
