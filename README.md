<div align="center">

# 🛍️ ENEXT - Modern E-Commerce Platform

**A complete, production-ready e-commerce solution built with Next.js 14 and MySQL**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](https://github.com/coding-with-maaz/ENEXT)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)](https://github.com/coding-with-maaz/ENEXT)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Available-brightgreen?style=for-the-badge&logo=vercel)](https://your-demo-url.vercel.app)
[![Documentation](https://img.shields.io/badge/Documentation-Available-blue?style=for-the-badge)](https://github.com/coding-with-maaz/ENEXT#readme)

</div>

---

## 📸 Screenshot

<img width="1864" height="877" alt="ENEXT E-Commerce Platform" src="https://github.com/user-attachments/assets/ff0dabf0-483c-4ac9-a92a-614cee3c91c2" />

---

## ✨ Features

### 🛒 E-Commerce Features
- ✅ **Product Catalog** - Browse and search products with advanced filtering
- ✅ **Shopping Cart** - Add to cart with persistent storage
- ✅ **Checkout Flow** - Multi-step checkout with payment integration
- ✅ **Order Management** - Track orders and view order history
- ✅ **Product Details** - Detailed product pages with images, reviews, and FAQs
- ✅ **Responsive Design** - Mobile-first, fully responsive UI

### 🎨 Modern UI/UX
- ✅ **Hero Slider** - Beautiful image carousel with auto-play
- ✅ **Animations** - Smooth transitions and hover effects
- ✅ **Glassmorphism** - Modern glassmorphic design elements
- ✅ **Dark/Light Themes** - Elegant color schemes
- ✅ **Loading States** - Skeleton loaders and loading indicators

### 👨‍💼 Admin Panel
- ✅ **Dashboard** - Analytics and statistics overview
- ✅ **User Management** - Full CRUD operations for users
- ✅ **Product Management** - Manage products, inventory, and pricing
- ✅ **Order Management** - View and update order statuses
- ✅ **Footer Management** - Customize footer content from admin
- ✅ **Analytics** - Track revenue, orders, and growth metrics
- ✅ **Settings** - Configure site settings and preferences

### 🔧 Technical Features
- ✅ **TypeScript** - Full type safety
- ✅ **API Routes** - RESTful API endpoints
- ✅ **Database Integration** - MySQL with connection pooling
- ✅ **Reusable Components** - Modular, maintainable codebase
- ✅ **Form Validation** - Client and server-side validation
- ✅ **Error Handling** - Comprehensive error management

---

## 🚀 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 14.2.5 | React framework with App Router |
| [React](https://reactjs.org/) | 18.3.1 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.5.4 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.18 | Utility-first CSS |
| [Lucide React](https://lucide.dev/) | 0.414.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| [MySQL](https://www.mysql.com/) | 8.0+ | Database |
| [mysql2](https://github.com/sidorares/node-mysql2) | 3.9.2 | MySQL client |
| [Node.js](https://nodejs.org/) | 18+ | Runtime environment |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| [ESLint](https://eslint.org/) | 8.57.0 | Code linting |
| [PostCSS](https://postcss.org/) | 8.5.6 | CSS processing |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | 10.4.22 | CSS vendor prefixes |

---

## 📦 Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://www.mysql.com/downloads/)
- **npm**, **yarn**, or **pnpm**

### Step 1: Clone the Repository

```bash
git clone https://github.com/coding-with-maaz/ENEXT.git
cd ENEXT
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Set Up Database

#### Option A: Using MySQL Command Line

```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS enext_db;
USE enext_db;
```

```bash
mysql -u root -p enext_db < lib/schema.sql
```

#### Option B: Using MySQL Workbench

1. Create a new database named `enext_db`
2. Import and execute the SQL statements from `lib/schema.sql`

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=enext_db
```

### Step 5: Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
ENEXT/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── page.tsx        # Admin dashboard
│   │   ├── users/          # User management
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   ├── analytics/      # Analytics page
│   │   ├── settings/       # Settings page
│   │   └── footer/         # Footer management
│   ├── api/                # API routes
│   │   ├── users/          # User endpoints
│   │   ├── products/       # Product endpoints
│   │   └── orders/         # Order endpoints
│   ├── checkout/           # Checkout pages
│   ├── product/            # Product detail pages
│   ├── shop/               # Shop page
│   ├── cart/               # Shopping cart
│   └── layout.tsx          # Root layout
├── components/
│   ├── admin/              # Admin components
│   │   ├── AdminLayout.tsx
│   │   ├── DataTable.tsx
│   │   ├── FormModal.tsx
│   │   └── StatusBadge.tsx
│   ├── ui/                 # Reusable UI components
│   ├── AnimatedNavbar.tsx
│   ├── Footer.tsx
│   └── HeroSlider.tsx
├── contexts/
│   └── CartContext.tsx     # Shopping cart context
├── lib/
│   ├── db.ts               # Database connection
│   ├── constants.ts        # Server constants
│   ├── client-constants.ts # Client constants
│   ├── queries.ts          # SQL queries
│   ├── utils.ts            # Utility functions
│   └── product-images.ts   # Product image utilities
└── public/                 # Static assets
```

---

## 🔌 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users |
| `POST` | `/api/users` | Create a new user |
| `GET` | `/api/users/[id]` | Get user by ID |
| `PUT` | `/api/users/[id]` | Update user |
| `DELETE` | `/api/users/[id]` | Delete user |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products |
| `POST` | `/api/products` | Create a new product |
| `GET` | `/api/products/[id]` | Get product by ID |
| `PUT` | `/api/products/[id]` | Update product |
| `DELETE` | `/api/products/[id]` | Delete product |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Get all orders |
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders/[id]` | Get order by ID |

---

## 🎯 Key Features in Detail

### 🛍️ Shopping Experience
- **Product Browsing**: Advanced search, filtering, and sorting
- **Product Details**: Image gallery, reviews, FAQs, specifications
- **Shopping Cart**: Persistent cart with localStorage
- **Checkout**: Multi-step checkout with validation
- **Order Tracking**: View order history and status

### 👨‍💼 Admin Features
- **Dashboard**: Real-time statistics and analytics
- **User Management**: Create, edit, delete users
- **Product Management**: Full product CRUD with inventory tracking
- **Order Management**: View and update order statuses
- **Footer Management**: Customize footer content
- **Settings**: Configure site-wide settings

### 🎨 Design Features
- **Modern UI**: Glassmorphism, gradients, animations
- **Responsive**: Mobile-first design
- **Accessible**: ARIA labels and semantic HTML
- **Fast**: Optimized performance with Next.js

---

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run init-db` | Initialize database |

---

## 📊 Database Schema

The application includes the following tables:

- **users** - User information
- **products** - Product catalog
- **orders** - Order records
- **order_items** - Order line items

See `lib/schema.sql` for the complete schema definition.

---

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/coding-with-maaz/ENEXT)

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- **Netlify**
- **AWS Amplify**
- **Railway**
- **DigitalOcean App Platform**

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Maaz**

- GitHub: [@coding-with-maaz](https://github.com/coding-with-maaz)
- Repository: [ENEXT](https://github.com/coding-with-maaz/ENEXT)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Lucide](https://lucide.dev/) for the beautiful icons
- All contributors and users of this project

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

[![GitHub stars](https://img.shields.io/github/stars/coding-with-maaz/ENEXT.svg?style=social&label=Star)](https://github.com/coding-with-maaz/ENEXT)
[![GitHub forks](https://img.shields.io/github/forks/coding-with-maaz/ENEXT.svg?style=social&label=Fork)](https://github.com/coding-with-maaz/ENEXT)
[![GitHub watchers](https://img.shields.io/github/watchers/coding-with-maaz/ENEXT.svg?style=social&label=Watch)](https://github.com/coding-with-maaz/ENEXT)

**Made with ❤️ using Next.js and MySQL**

</div>
