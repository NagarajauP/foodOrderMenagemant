# 🍽️ Food Order Management System (Full Stack)

A full-stack Food Ordering and Management web application built with **Spring Boot (REST API)** and **React + Vite**. It allows customers to browse food items, place orders with real-time bill calculations, track orders live, and provides a management dashboard for order fulfillment, revenue analytics, and printable invoices.

---

## 🌟 Key Features

### 👤 Customer Features
- **Interactive Food Menu:** Browse curated dishes categorized into *Starters, Main Course, Fast Food, Beverages, and Desserts* with Veg / Non-Veg badges and ratings.
- **Instant Item Selection:** One-click "Order Now" pre-fills the checkout form with selected dish details.
- **Fast Checkout & Order Placement:** Customer details (Name, Email, Phone, Delivery Address, Payment Mode) with real-time subtotal computation and celebratory confetti on placement.
- **Live Order Tracking:** Enter Order ID to view progress across lifecycle stages:
  - 📦 *Order Placed*
  - 🍳 *In Kitchen (Preparing)*
  - 🛵 *Out for Delivery*
  - ✅ *Delivered*

### 🛠️ Admin / Restaurant Management Console
- **Live Metrics Dashboard:** Total Orders, Total Revenue (₹), Pending Orders, Preparing/Transit, and Delivered counters.
- **Advanced Filtering & Search:**
  - Real-time search by Customer Name, Order ID, Food Item, or Delivery Address.
  - Filter orders by Customer Email (`/foodorder/getorders/email/{email}`).
  - Filter orders by Status (`/foodorder/getorders/status/{status}`).
- **Quick Status Updates:** Directly advance order status via inline dropdown (`PENDING` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` ➔ `CANCELLED`).
- **Order Editing:** Comprehensive modal to edit all order details and customer contact info.
- **Printable Tax Invoices / Receipts:** Generates itemized billing receipts ready for printing.
- **Order Deletion:** Permanent deletion with safety confirmation modal.
- **Backend Health Monitor:** Live indicator of Spring Boot backend connectivity with custom API URL settings.

---

## 🏗️ Project Architecture

```
foodOrderMenagemant/
├── Food-order-management/             # Spring Boot Backend (Maven)
│   ├── src/main/java/                 # Java controllers, models, repos, services
│   │   └── vcube/Food/order/management/
│   │       ├── controller/FoodOrderController.java
│   │       ├── model/Foodordermanagement.java
│   │       ├── repo/FoodOrderRepo.java
│   │       └── service/FoodOrderServiceImpl.java
│   ├── src/main/resources/
│   │   ├── application.properties    # Port: 2131, MySQL DB config
│   │   └── static/                   # Production-built React frontend
│   └── pom.xml
│
├── frontend/                          # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/               # Navbar, Catalog, Form, Dashboard, Tracking, Invoices
│   │   ├── data/menuData.js          # Menu catalogue and constants
│   │   ├── services/api.js           # Axios REST API client
│   │   ├── App.jsx                   # Main application controller
│   │   └── index.css                 # Custom responsive design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (JDK 17 or higher)
- **Maven** (or use included `mvnw`)
- **MySQL Database Server**
- **Node.js 18+** & **npm** (for frontend development)

---

### 1. Database Setup
Ensure MySQL is running on your system. Create the database configured in `application.properties`:

```sql
CREATE DATABASE vcube;
```

Update `Food-order-management/src/main/resources/application.properties` with your MySQL credentials:
```properties
server.port=2131
spring.datasource.url=jdbc:mysql://localhost:3306/vcube?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

---

### 2. Run the Spring Boot Backend

Open a terminal in `Food-order-management`:

```bash
cd Food-order-management

# On Windows:
.\mvnw.cmd spring-boot:run

# On Linux/macOS:
./mvnw spring-boot:run
```

The backend server starts on: **`http://localhost:2131`**

> **Note:** The built frontend has also been bundled into `Food-order-management/src/main/resources/static`. When the Spring Boot app is running, visiting `http://localhost:2131` directly opens the complete frontend in your browser!

---

### 3. Run the Frontend (Development Mode)

For live hot-reloading development of the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server starts on: **`http://localhost:3000`** (or `http://localhost:5173`) and automatically communicates with the Spring Boot backend on `http://localhost:2131`.

To build the frontend for production:
```bash
npm run build
```

---

## 📡 REST API Endpoints

All endpoints are hosted under `/foodorder`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/foodorder/wel` | Server health check & welcome greeting |
| `POST` | `/foodorder/create` | Create a new food order (auto-computes `totalAmount`) |
| `GET` | `/foodorder/getorders` | Retrieve list of all orders |
| `GET` | `/foodorder/getOrder/{orderId}` | Retrieve specific order by ID |
| `PUT` | `/foodorder/update/{orderId}` | Update an existing order by ID |
| `DELETE` | `/foodorder/delete/{orderId}` | Delete order by ID |
| `GET` | `/foodorder/getorders/email/{email}` | Search orders by customer email |
| `GET` | `/foodorder/getorders/status/{status}` | Filter orders by status |

### Order Data Model (JSON)
```json
{
  "orderId": 1,
  "customerName": "Rahul Sharma",
  "customerEmail": "rahul@example.com",
  "customerPhone": 9876543210,
  "foodItem": "Hyderabadi Chicken Biryani",
  "category": "Main Course",
  "quantity": 2,
  "price": 340.0,
  "totalAmount": 680.0,
  "orderStatus": "PENDING",
  "deliveryAddress": "Flat 302, Green Valley Apartments, Hyderabad",
  "paymentMode": "UPI / Google Pay"
}
```

---

## 💻 Tech Stack
- **Backend:** Java, Spring Boot 3, Spring Data JPA, Hibernate, MySQL, Lombok
- **Frontend:** React 19, Vite, Lucide Icons, Axios, Canvas Confetti
- **Styling:** Custom CSS design system (Plus Jakarta Sans, responsive flex/grid layouts, card elevation, print stylesheets)
