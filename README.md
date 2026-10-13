# Retain — Personal Expense & Budget Manager

A full-stack web application for managing personal expenses and monthly budgets.

**Live App:** https://retain-expense-manager.vercel.app
**GitHub:** https://github.com/Hannah1563/retain-expense-manager

---

## Main Features

### User
- Sign up, sign in, sign out with JWT authentication
- Create, view, update, and delete personal expenses
- Each expense includes: title, amount, category, date, payment method, and optional notes
- Filter expenses by category, payment method, and date range
- Search expenses by keyword
- Sort expenses by date or amount (ascending/descending)
- Paginated expense list (10 per page)
- Set and monitor a monthly budget showing:
  - Total amount spent
  - Remaining budget
  - Status: Within Budget / Approaching Limit / Over Budget
- User dashboard showing:
  - Total spending for the current month
  - Remaining monthly budget
  - Highest individual expense
  - Spending by category
  - Recent expenses

### Admin
- Protected admin dashboard (role-based, React Context)
- Create, update, and delete expense categories
- Deleting a category reassigns its expenses to "Uncategorized"
- Platform insights:
  - Total registered users
  - Total expenses recorded
  - Total value of all expenses
  - Number of expenses this month
  - Total spending per category
  - Top 5 most-used categories
  - Bottom 5 least-used categories
  - Recently added expenses
  - Recently registered users

---

## Technologies Used

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework with type safety |
| Vite | Build tool |
| Material-UI v9 | Component library for responsive UI |
| React Router v6 | Client-side routing & protected routes |
| Redux Toolkit | Expense filtering, searching, sorting state |
| React Context | Authentication, user roles, protected routes |
| Axios | HTTP client with JWT interceptor |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT + bcryptjs | Authentication & password hashing |
| CORS | Cross-origin requests |

---

## Project Structure

```
retain-expense-manager/
├── frontend/               # React + TypeScript + Vite
│   └── src/
│       ├── api/            # Axios instance with JWT interceptor
│       ├── components/     # Reusable components (StatCard, ExpenseCard, ExpenseForm, Layout)
│       ├── context/        # AuthContext — auth, roles, protected routes
│       ├── pages/          # Login, Register, Dashboard, Expenses, Budget, Admin
│       ├── store/          # Redux store + filtersSlice
│       └── types/          # TypeScript interfaces for all entities
└── backend/                # Node.js + Express
    └── src/
        ├── controllers/    # auth, expense, budget, category, admin
        ├── middleware/      # JWT auth guard + admin-only guard
        ├── models/         # User, Expense, Category, Budget
        └── routes/         # /auth, /expenses, /budget, /categories, /admin
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
node server.js
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL
npm run dev
```

### Seed Default Categories

```bash
cd backend
node seed.js
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get paginated expenses with filters |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

**Query params:** `search`, `category`, `paymentMethod`, `startDate`, `endDate`, `sortBy`, `order`, `page`, `limit`

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budget?month=&year=` | Get budget + spending summary |
| POST | `/api/budget` | Create or update budget |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories (protected) |
| POST | `/api/categories` | Create category (admin only) |
| PUT | `/api/categories/:id` | Update category (admin only) |
| DELETE | `/api/categories/:id` | Delete category (admin only) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/insights` | Platform-wide insights (admin only) |

---

## Making a User an Admin

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## Deployment

- **Frontend:** [Vercel](https://vercel.com) — set `VITE_API_URL` in environment variables
- **Backend:** [Render](https://render.com) — set `MONGO_URI`, `JWT_SECRET`, `PORT` in environment variables
