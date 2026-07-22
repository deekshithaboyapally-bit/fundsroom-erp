# Fundsroom ERP + CRM Portal

A Mini ERP and CRM system built for a wholesale distribution company. 
This system helps internal teams manage customers, products, stock, 
and sales challans from a single platform.

---

## 🔗 Live Links

- **Frontend:** https://fundsroom-erp-jqbw.vercel.app
- **Backend:** https://fundsroom-erp-cm0q.onrender.com
- **GitHub:** https://github.com/deekshithaboyapally-bit/fundsroom-erp

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon)
- JWT Authentication
- REST APIs

### Frontend
- React.js
- Axios
- React Router DOM
- Inline CSS for styling

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon (PostgreSQL)

---

## ✨ Features Built

### 🔐 Authentication
- Login with email and password
- JWT token generated on successful login
- 4 roles supported: Admin, Sales, Warehouse, Accounts

### 👥 Customer CRM
- Add new customers with full details
- View all customers in a table
- Search customers by name, email, or mobile
- Fields: Name, Mobile, Email, Business Name, GST Number, Type, Address, Status, Follow-up Date, Notes
- Customer types: Retail, Wholesale, Distributor
- Status options: Lead, Active, Inactive

### 📦 Product & Inventory
- Add new products with SKU, category, price, stock
- View all products in a table
- Search products by name or SKU
- Low stock alert: row highlighted in yellow when stock falls below minimum alert level
- Stock movement automatically logged when challan is confirmed

### 🧾 Sales Challan
- Create challan by selecting customer and products
- Add multiple products in a single challan
- Challan number auto-generated (`CHL-timestamp`)
- Status options: Draft, Confirmed, Cancelled
- When challan is confirmed:
  - Stock is automatically reduced
  - Stock cannot go below zero
  - Proper error shown if stock is insufficient
  - Product snapshot saved (name, SKU, price at time of sale)
- View all challans in a table with color-coded status badges

---

## 🗄 Database Tables

- `users`
- `customers`
- `products`
- `stock_movements`
- `challans`
- `challan_items`

---

## 📁 Project Structure
fundsroom-erp/
├── backend/
│ ├── index.js # Main server file with all APIs
│ ├── package.json # Backend dependencies
│ └── .env # Environment variables (not committed)
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Login.js
│ │ │ ├── Dashboard.js
│ │ │ ├── Customers.js
│ │ │ ├── Products.js
│ │ │ └── Challans.js
│ │ └── App.js # Routing configuration
│ └── package.json
├── Fundsroom ERP APIs.postman_collection.json
└── README.md

---

## 🚀 How to Run Locally

### Step 1: Clone the repository
```bash
git clone https://github.com/deekshithaboyapally-bit/fundsroom-erp.git
cd fundsroom-erp
Step 2: Setup Backend
cd backend
npm install
Create a .env file inside the backend folder:
DATABASE_URL=your_neon_postgresql_connection_string
PORT=5000
Start the backend server:
node index.js
Backend runs at: http://localhost:5000
Step 3: Setup Frontend
Open a new terminal:
cd frontend
npm install
npm start
Frontend runs at: http://localhost:3000

🔌 API Endpoints
Authentication
Method	Endpoint	Description
POST	/auth/login	Login and get JWT token

Customers
Method	Endpoint	Description
GET	/customers	Get all customers (supports search)
POST	/customers	Add new customer
GET	/customers/:id	Get customer by ID
PUT	/customers/:id	Update customer
POST	/customers/:id/notes	Add follow-up note

Products
Method	Endpoint	Description
GET	/products	Get all products (supports search)
POST	/products	Add new product
GET	/products/:id	Get product by ID
PUT	/products/:id	Update product

Challans
Method	Endpoint	Description
GET	/challans	Get all challans
POST	/challans	Create new challan
GET	/challans/:id	Get challan with items
PUT	/challans/:id	Update challan status


🔑 Test Login Credentials
Role	Email	Password
Admin	admin@test.com	Admin@123
Sales	sales@test.com	Sales@123
Warehouse	warehouse@test.com	Warehouse@123
Accounts	accounts@test.com	Accounts@123

🏗 Architecture
React (Vercel)
     ↓ HTTP requests (Axios)
Express REST API (Render)
     ↓ SQL queries
PostgreSQL (Neon Cloud)

.User logs in → Backend checks DB → JWT token returned → Stored in localStorage
.Challan confirmed → Backend starts DB transaction → Checks stock → Reduces stock → Saves items → Commits
.If stock insufficient → Transaction rolled back → Error returned to frontend

⚙ Environment Variables
Backend (.env)
DATABASE_URL=postgresql://...
PORT=5000

☁ Deployment Steps
Backend (Render)
Connect GitHub repo to Render
Root Directory: backend
Build Command: npm install
Start Command: node index.js
Add environment variable: DATABASE_URL

Frontend (Vercel)
Connect GitHub repo to Vercel
Root Directory: frontend
Framework: Create React App
Deploy

⚠ Known Limitations
Passwords stored as plain text (bcrypt hashing should be added for production)
No role-based route protection on frontend yet
No pagination on lists (fine for small datasets)
Challan cannot be edited or deleted after creation
No PDF invoice export
No product image upload
Render free tier sleeps after inactivity (first request may take 20–30 seconds)

📮 Postman Collection
Import the file Fundsroom ERP APIs.postman_collection.json into Postman to test all APIs directly.

🔮 What I Would Improve Next
Add bcrypt password hashing
Add role-based access control middleware
Add pagination for large datasets
Add PDF invoice export
Add edit/delete functionality for challans
Add frontend form validation
Add unit tests for APIs