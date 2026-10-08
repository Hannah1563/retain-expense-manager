# Retain — Personal Expense & Budget Manager

A full-stack web application for managing personal expenses and monthly budgets.

🚀 **Live App:** https://retain-expense-manager.vercel.app
🔗 **API Base URL:** https://retain-backend-oky1.onrender.com/api

---

## Features

### User
- Sign up, sign in, sign out with JWT authentication
- Create, view, update, and delete personal expenses
- Filter and search expenses by category, payment method, date range, and keyword
- Sort expenses by date or amount
- Paginated expense list
- Set and monitor a monthly budget (total spent, remaining, status)
- User dashboard: total spending, remaining budget, highest expense, spending by category, recent expenses

### Admin
- Protected admin dashboard (role-based access via React Context)
- Create, update, and delete expense categories
- Platform insights: total users, total expenses, total value, monthly count, spending per category, top/bottom 5 categories, recent expenses, recent users

---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Material-UI v9 | Component library |
| React Router v6 | Client-side routing |
| Redux Toolkit | Expense filtering/searching/sorting state |
| React Context | Authentication & protected routes |
| Axios | HTTP client |

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
│       ├── api/            # Axios instance
│       ├── components/     # Reusable components (layout, expenses)
│       ├── context/        # AuthContext (React Context)
│       ├── pages/          # Login, Register, Dashboard, Expenses, Budget, Admin
│       ├── store/          # Redux store + filtersSlice
│       └── types/          # TypeScript interfaces
└── backend/                # Node.js + Express
    └── src/
        ├── controllers/    # authController, expenseController, budgetController, categoryController, adminController
        ├── middleware/      # JWT auth + admin guard
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
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL
npm run dev
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
| GET | `/api/expenses` | Get expenses (supports filters, pagination, sorting) |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

**Query params for GET /expenses:** `search`, `category`, `paymentMethod`, `startDate`, `endDate`, `sortBy`, `order`, `page`, `limit`

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

After registering, update the user's role directly in MongoDB:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com) — set `VITE_API_URL` in environment variables
- **Backend:** Deployed on [Render](https://render.com) — set `MONGO_URI`, `JWT_SECRET`, `PORT` in environment variables
