# ENEXT

A complete Next.js application with MySQL database integration, featuring full CRUD operations for users, products, and orders.

## Features

- ✅ **Next.js 14** with App Router
- ✅ **MySQL Database** integration with connection pooling
- ✅ **TypeScript** for type safety
- ✅ **RESTful API Routes** for all operations
- ✅ **Full CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Modern UI** with responsive design
- ✅ **User Management** - Create, edit, and delete users
- ✅ **Product Management** - Manage products with pricing and inventory
- ✅ **Order Management** - View orders with items and totals

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **npm**, **yarn**, or **pnpm**

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/coding-with-maaz/ENEXT.git
cd ENEXT
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up MySQL Database

#### Option A: Using MySQL Command Line

1. Log in to MySQL:
```bash
mysql -u root -p
```

2. Create the database:
```sql
CREATE DATABASE IF NOT EXISTS enext_db;
USE enext_db;
```

3. Run the schema file:
```bash
mysql -u root -p enext_db < lib/schema.sql
```

#### Option B: Using MySQL Workbench or phpMyAdmin

1. Create a new database named `enext_db`
2. Import and execute the SQL statements from `lib/schema.sql`

### 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and update with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=enext_db
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── users/        # User CRUD endpoints
│   │   ├── products/     # Product CRUD endpoints
│   │   └── orders/       # Order endpoints
│   ├── users/            # Users management page
│   ├── products/         # Products management page
│   ├── orders/           # Orders view page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── lib/
│   ├── db.ts             # MySQL connection pool
│   ├── schema.sql        # Database schema
│   └── init-db.ts        # Database initialization utility
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders

- `GET /api/orders` - Get all orders with items
- `POST /api/orders` - Create a new order

## Database Schema

The application includes the following tables:

- **users** - User information
- **products** - Product catalog
- **orders** - Order records
- **order_items** - Order line items

See `lib/schema.sql` for the complete schema definition.

## Usage

1. **Start the development server** (see Development section above)
2. **Navigate to the home page** at http://localhost:3000
3. **Manage Users**: Click "Manage Users" to add, edit, or delete users
4. **Manage Products**: Click "Manage Products" to add, edit, or delete products
5. **View Orders**: Click "View Orders" to see all orders (create orders via API)

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running: `mysql -u root -p`
- Check your `.env` file has correct credentials
- Ensure the database `enext_db` exists
- Verify the schema has been imported correctly

### Port Already in Use

If port 3000 is already in use, you can change it by modifying the dev script in `package.json`:
```json
"dev": "next dev -p 3001"
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [MySQL Documentation](https://dev.mysql.com/doc/) - MySQL database documentation
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript language reference

## License

This project is open source and available under the MIT License.

