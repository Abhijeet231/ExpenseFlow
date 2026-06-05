# ExpenseFlow

A role-based expense management system that allows users to create and submit expense claims, while managers can review, approve, or reject them.

## Features

### User

* Register & Login
* Create expense claims
* Save expenses as Draft
* Submit expenses for review
* View expense status
* Search and filter expenses

### Manager

* Review submitted expenses
* Approve or reject expense claims
* View expense history
* Search and filter expenses

## Tech Stack

### Frontend

* React
* Tailwind CSS
* React Router
* React Hook Form
* Zod

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

## Expense Workflow

Draft → Submitted → Approved / Rejected

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd expenseflow
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the server directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Project Status

Currently under development.
