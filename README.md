# 📦 Full Stack Inventory Management System

A robust, full-stack inventory management dashboard built to streamline product tracking, stock management, and inventory history. The application supports bulk CSV operations, real-time filtering, and detailed change logging.

## 🚀 Live Demo

- **Frontend (Vercel):**  [Vercel Deployed Link](https://inventory-management-system-zld4.vercel.app/)
- **Backend (Render):**  [Render Deployed Link](https://inventory-management-system-oh0r.onrender.com)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** Custom CSS (Responsive & Clean UI)
- **Routing:** React Router v6 (Protected Routes)
- **HTTP Client:** Axios
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (Relational, File-based)
- **Authentication:** JWT & BCrypt
- **File Handling:** Multer & CSV-Parser

---

## ✨ Key Features

1.  **Product Management (CRUD):**
    - Create, Read, Update, and Delete products.
    - Inline editing for quick stock adjustments.
    - Color-coded status badges ("In Stock" vs "Out of Stock").

2.  **Advanced Search & Sort:**
    - Server-side search by product name.
    - Client-side category filtering.
    - Column-based sorting (Name, Category, Stock, Brand, etc.).

3.  **Bulk Operations:**
    - **Import CSV:** Bulk upload products with duplicate detection logic.
    - **Export CSV:** Download current inventory state to a CSV file (Timestamped to prevent caching).

4.  **Inventory History Tracking:**
    - Automatically logs every stock change.
    - Slide-in sidebar displays a timeline of who changed stock and when.

5.  **Authentication & Security:**
    - User Registration & Login.
    - JWT-based session management.
    - Protected Dashboard routes (redirects to login if unauthenticated).

---

## 📂 Project Structure

This is a **Monorepo** structure containing both client and server code.

```text
/root
├── backend
│   ├── controllers/
│   ├── models/
│   │   └── db.js
│   ├── routes/
│   │   ├── products.js
│   │   └── user.js
│   ├── uploads/
│   ├── inventory.db
│   ├── package.json
│   └── server.js
├── frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddProductModal/
│   │   │   │   ├── index.css
│   │   │   │   └── index.jsx
│   │   │   ├── DeleteProductModal/
│   │   │   │   ├── index.css
│   │   │   │   └── index.jsx
│   │   │   ├── Header/
│   │   │   │   ├── index.css
│   │   │   │   └── index.jsx
│   │   │   ├── HistorySidebar/
│   │   │   │   ├── index.css
│   │   │   │   └── index.jsx
│   │   │   ├── Login/
│   │   │   │   ├── index.css
│   │   │   │   └── index.jsx
│   │   │   ├── ProductTable/
│   │   │   │   ├── index.css
│   │   │   │   └── index.jsx
│   │   │   └── ProtectedRoute/
│   │   │       └── index.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
├── .gitignore
└── package.json
```
## ⚙️ Installation & Running Locally

Follow these steps to get the project running on your local machine.

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone the Repository
- git clone [https://github.com/Kundan-Rawal/Inventory_Management_System_.git](https://github.com/Kundan-Rawal/Inventory_Management_System_.git)
- cd inventory_management_system_

### 2. Setup Backend
cd backend
npm install

# Start the server (Runs on Port 3000)
node server.js

(You should see: "Server Running at http://localhost:3000/")
Note: The inventory.db file will be created automatically.

### 3. Setup Frontend
Open a NEW terminal (keep backend running).

cd frontend
npm install

# Start the Vite dev server
npm run dev

(Open the URL shown, usually http://localhost:5173, in your browser)

---

## 📡 API Endpoints

### Products
- GET /api/products?name=query  -> Fetch all products or search by name.
- POST /api/products            -> Create a single product.
- PUT /api/products/:id         -> Update product details (logs history automatically).
- DELETE /api/products/:id      -> Delete a product.
- POST /api/products/import     -> Upload CSV file (Multipart/form-data).
- GET /api/products/export      -> Download inventory as CSV.

### History
- GET /api/products/:id/history -> Get change logs for a specific product.

### Auth
- POST /api/auth/register       -> Register a new user.
- POST /api/auth/login          -> Login and receive JWT.

---

## ⚠️ Important Note on Deployment

**Database Behavior on Render (Free Tier):**
This application uses **SQLite**, which is a file-based database. 
- On Render's Free Tier, the file system is **ephemeral**.
- This means **the database resets** (wipes data) whenever the server restarts or redeploys.
- **Recommendation:** For a persistent production environment, switch the database connection to PostgreSQL or MongoDB Atlas. For this assignment/demo, SQLite is used for simplicity and ease of setup.

---

## 🧪 Testing Credentials
You can register a new user or use these demo credentials (if I haven't redeployed recently):

- **Username:** kundan
- **Password:** 12345

---

Built with ❤️ by Kundan Rawal