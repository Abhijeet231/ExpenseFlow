# ExpenseFlow

A full-stack role-based expense management system. Employees can create, draft, and submit expense claims. Managers can review, approve, or reject them - all in one clean interface.

## Workflow

```
Employee creates expense / saves as Draft → submits for review → Manager approves or rejects
```

## Features

### Employee
- Register and login with JWT-based auth (cookie)
- Create expense claims with receipt upload (Cloudinary)
- Save as draft or submit directly
- Edit and delete draft expenses
- Filter expenses by status - Draft, Submitted, Approved, Rejected
- Search expenses by description

### Manager
- View all pending (submitted) expense requests
- Approve or reject with one click
- View full expense history with filters and search

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Tailwind CSS, React Router, React Hook Form, Zod |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT (httpOnly cookie) |
| File Upload | Multer + Cloudinary |
| Validation | Zod (frontend + backend) |

## Project Structure

```
expenseflow/
├── client/          # React frontend (Vite)
└── server/          # Express backend
```

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository

```bash
git clone <repository-url>
cd expenseflow
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_jwt_secret_key
ACCESS_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CORS_ORIGIN=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Frontend setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Variables

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server runs on | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `ACCESS_TOKEN_SECRET` | Secret key for signing JWTs | any long random string |
| `ACCESS_TOKEN_EXPIRY` | JWT expiry duration | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | from Cloudinary dashboard |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### Frontend (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |

## API Routes

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Expenses (Employee only)
```
POST   /api/expense
GET    /api/expense/my
GET    /api/expense/:expenseId
PATCH  /api/expense/:expenseId
DELETE /api/expense/:expenseId
```

### Manager (Manager only)
```
GET    /api/manager/pending
PATCH  /api/manager/:expenseId/status
GET    /api/manager/history
```

## Roles

| Role | Access |
|---|---|
| `user` | Employee — can manage own expenses |
| `manager` | Manager — can review all submitted expenses |

> Role is selected at registration. A manager account cannot access employee routes and vice versa.

## Notes

- Receipts are optional on expense creation
- Only `draft` expenses can be edited or deleted
- Submitted, approved, and rejected expenses are locked from edits
- Auth is handled via `httpOnly` cookies — no manual token management needed on the frontend

## Developer
 
**Abhijit Ghosh**
 
| | |
|---|---|
| 🌐 Portfolio | [abhijeetghosh.site](https://www.abhijeetghosh.site/) |
| 💼 LinkedIn | [linkedin.com/in/abhijit-ghosh-63b624235](https://www.linkedin.com/in/abhijit-ghosh-63b624235/) |
| 𝕏 Twitter | [@Abhijit_091](https://x.com/Abhijit_091) |