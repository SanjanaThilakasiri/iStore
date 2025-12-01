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

## ScreenShots
<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/8b3c4745-3081-4e61-8db7-fc4b6d76c998" />

![Screenshot 2025-07-04 190423](https://github.com/user-attachments/assets/307fae20-1b6f-4aa5-a40d-bc788234f6e8)
![Screenshot 2025-07-04 190437](https://github.com/user-attachments/assets/e5203873-20ae-4bd5-be44-e73365b1e809)

<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/33b43768-4bd5-4c31-ab0d-c9fc15b761ca" />

<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/2f3ea364-e7f6-4462-88cc-d80e3168c206" />

<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/3aea48fc-2224-4e35-be4a-3403ec07f626" />



<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/bae240e4-2c7d-4791-9a67-06a2c56a94e7" />
<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/3792d49d-b93f-460b-ab1b-394069bd45de" />



![Screenshot 2025-07-04 191838](https://github.com/user-attachments/assets/b65c90a1-375f-45cb-a558-82808a5092ad)
![Screenshot 2025-07-04 190357](https://github.com/user-attachments/assets/2b9a4e1b-1c8f-4903-af5e-c906771089ba)

![Screenshot 2025-07-04 190741](https://github.com/user-attachments/assets/d22f54b4-786c-4e5b-9a97-6c7b830f7ad3)

![Screenshot 2025-07-04 190751](https://github.com/user-attachments/assets/367125f6-fc6e-454e-84fc-76fd8bf085dc)
![Screenshot 2025-07-04 190838](https://github.com/user-attachments/assets/c6f4e187-8af4-4137-977a-d1e6eea0ddb1)

![Screenshot 2025-07-04 192812](https://github.com/user-attachments/assets/90a1d761-d2df-4478-b31a-0e7a2dac7ead)
![Screenshot 2025-07-04 190622](https://github.com/user-attachments/assets/f4cfc8bd-e1a9-4ca6-a702-a6ec264b3917)














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

