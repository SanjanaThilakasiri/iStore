# iStore

iStore is a full-stack e-commerce application for Apple products, featuring a modern shopping experience, secure user authentication, and robust admin management. The platform allows users to browse, search, and purchase products, while administrators can manage inventory and orders.

## Features

- **User Authentication:** Secure registration, login, and profile management.
- **Product Catalog:** Browse, search, and filter Apple products (iPhone, Mac, iPad, iWatch, AirPods, Accessories).
- **Shopping Cart:** Add, update, and remove items from the cart.
- **Checkout & Payment:** Integrated payment processing and invoice generation.
- **Order History:** View past orders and download invoices.
- **Admin Dashboard:** Add, edit, and delete products; manage inventory.
- **Responsive Design:** Optimized for desktop and mobile devices.

## Technologies Used

- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js, MongoDB
- **Admin Panel:** React.js, Vite
- **Styling:** Custom CSS (with Bootstrap or Tailwind CSS optional)
- **Payment:** Stripe API
- **File Uploads:** Multer for product images

## Getting Started

To run iStore locally, follow these steps:

### Prerequisites

- Node.js >= 18.x
- npm
- MongoDB

### Installation

### 1. Clone the repository
```bash
git clone https://github.com/SanjanaThilakasiri/iStore.git
```

### 2. Backend Setup
```bash 
cd iStore/backend
npm install
cp .env.example .env
# Update MongoDB and Stripe credentials in .env
# Update MongoDB connection URL on index.js
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm start
```

### 4. Admin Panel Setup
```bash
cd ../admin
npm install
npm run dev
```

### Usage
- **Access the user site at:** http://localhost:3000
- **Access the admin panel at:** http://localhost:5173
- **Backend API runs at:** http://localhost:4000
### Contribution
- **Contributions are welcome! Please open an issue or submit a pull request for improvements or new features.**
