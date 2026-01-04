# 🛍️ E-commerce Product Management Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

**A modern, production-ready server-side rendered (SSR) administrative dashboard for managing products in an e-commerce system.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This is a **full-featured, production-ready** e-commerce product management dashboard built with modern web technologies. It provides administrators with a comprehensive interface to manage products, view analytics, and handle inventory operations efficiently.

### Key Highlights

- ✅ **Server-Side Rendering (SSR)** - Fast initial page loads and improved SEO
- ✅ **Complete CRUD Operations** - Full product management capabilities
- ✅ **Modern UI/UX** - Glassmorphism design with smooth animations
- ✅ **Secure Authentication** - Role-based access control with NextAuth.js
- ✅ **Real-time Analytics** - Interactive charts and data visualization
- ✅ **Cloud Image Storage** - Secure image uploads with Cloudinary
- ✅ **Type-Safe** - Full TypeScript implementation
- ✅ **Production Ready** - Optimized for performance and scalability

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure Login System** - Email/password authentication with NextAuth.js
- **Role-Based Access Control** - Admin-only routes with middleware protection
- **Session Management** - Secure JWT-based session handling
- **Password Security** - bcryptjs hashing for secure password storage
- **Protected Routes** - Automatic redirects for unauthorized access

### 📦 Product Management (CRUD)
- **Create Products** - Multi-step form with comprehensive validation
- **View Products** - Paginated list with search and filtering
- **Update Products** - Edit existing products with pre-filled forms
- **Delete Products** - Safe deletion with confirmation dialogs
- **Bulk Operations** - Efficient product management

### 📝 Multi-Step Product Form
- **Step 1: Basic Information** - Name, description, category, brand, SKU
- **Step 2: Pricing & Inventory** - Price, stock quantity, sales tracking
- **Step 3: Images** - Multiple image uploads with preview
- **Real-time Validation** - Zod schema validation with React Hook Form
- **Visual Progress Indicator** - Step-by-step navigation with icons

### 📊 Data Visualization
- **Dashboard Analytics** - Real-time statistics overview
- **Interactive Charts** - Recharts-powered visualizations
  - Products by Category (Pie Chart)
  - Top Selling Products (Bar Chart)
  - Sales by Category (Bar Chart)
- **Key Metrics** - Total products, stock, sales, low stock alerts
- **Responsive Charts** - Mobile-friendly data visualization

### 🖼️ Image Management
- **Cloudinary Integration** - Secure cloud-based image storage
- **Multiple Image Upload** - Support for multiple product images
- **Image Preview** - Real-time preview before upload
- **Image Validation** - File type and size validation (max 5MB)
- **Automatic Cleanup** - Images deleted when products are removed

### 👥 Admin Management
- **Admin Onboarding** - Secure admin creation (admin-only)
- **User Management** - Create and manage admin accounts
- **Access Control** - Role-based permissions

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Modern frosted glass effects
- **Smooth Animations** - Transitions and hover effects
- **Responsive Layout** - Mobile-first design
- **Toast Notifications** - Non-intrusive user feedback
- **Confirmation Dialogs** - Modern modal dialogs
- **Loading States** - Professional loading indicators
- **Empty States** - Helpful messages when no data

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.0.4 | React framework with SSR |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.3.3 | Type safety |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework |
| **React Hook Form** | 7.49.2 | Form management |
| **Zod** | 3.22.4 | Schema validation |
| **Recharts** | 2.10.3 | Data visualization |
| **TanStack Query** | 5.17.9 | Data fetching and caching |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 14.0.4 | Serverless API endpoints |
| **MongoDB** | - | NoSQL database |
| **Mongoose** | 8.0.3 | MongoDB ODM |
| **NextAuth.js** | 4.24.5 | Authentication |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Cloudinary** | 1.41.0 | Image storage |

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account ([Sign up](https://cloudinary.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yhillswebd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/ecommerce-db
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-db

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Create the first admin account**
   
   Run the setup script:
   ```bash
   node scripts/create-default-admin.js
   ```
   
   This creates a default admin:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

7. **Sign in**
   - Email: `admin@example.com`
   - Password: `admin123`

---

## 📁 Project Structure

```
yhillswebd/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── admin/
│   │   │   └── onboard/          # Admin creation endpoint
│   │   ├── auth/
│   │   │   └── [...nextauth]/   # NextAuth configuration
│   │   ├── products/             # Product CRUD endpoints
│   │   │   ├── [id]/            # Single product operations
│   │   │   └── stats/            # Dashboard statistics
│   │   └── upload/               # Image upload endpoint
│   ├── admin/                    # Admin dashboard pages
│   │   ├── dashboard/           # Main dashboard
│   │   ├── products/             # Product management
│   │   │   ├── new/             # Create product
│   │   │   └── [id]/edit/       # Edit product
│   │   └── onboard/              # Admin onboarding
│   ├── auth/
│   │   └── signin/               # Sign-in page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects)
│
├── components/                    # React components
│   ├── AdminLayout.tsx           # Admin layout wrapper
│   ├── ConfirmDialog.tsx         # Confirmation modal
│   ├── DashboardClient.tsx       # Dashboard charts
│   ├── Navbar.tsx                # Navigation bar
│   ├── ProductForm.tsx           # Product form (multi-step)
│   ├── ProductsClient.tsx        # Product list
│   ├── Toast.tsx                 # Toast notification
│   └── ToastProvider.tsx         # Toast context
│
├── lib/                           # Utility functions
│   ├── auth-config.ts            # NextAuth configuration
│   ├── auth.ts                   # Auth utilities
│   ├── cloudinary.ts             # Cloudinary helpers
│   ├── mongodb.ts                # Database connection
│   ├── providers.tsx             # Context providers
│   └── validations.ts            # Zod schemas
│
├── models/                        # Mongoose models
│   ├── Product.ts                # Product schema
│   └── User.ts                   # User schema
│
├── scripts/                       # Utility scripts
│   ├── create-admin.ts           # Admin creation script
│   └── create-default-admin.js   # Default admin script
│
├── types/                         # TypeScript types
│   └── next-auth.d.ts            # NextAuth type definitions
│
├── middleware.ts                  # Route protection
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce-db` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret key for JWT | Generate with `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Your cloud name from dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Your API key from dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Your API secret from dashboard |

### Getting Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### Getting MongoDB Connection String

**Local MongoDB:**
```
mongodb://localhost:27017/ecommerce-db
```

**MongoDB Atlas:**
1. Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP address
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce-db`

---

## 📖 Usage Guide

### Creating a Product

1. Navigate to **Products** → **New Product**
2. **Step 1:** Enter basic information (name, description, category, SKU)
3. **Step 2:** Set price and stock quantity
4. **Step 3:** Upload product images (optional)
5. Click **Create Product**

### Editing a Product

1. Go to **Products** page
2. Click **Edit** on any product card
3. Modify the information
4. Click **Update Product**

### Deleting a Product

1. Go to **Products** page
2. Click **Delete** on any product card
3. Confirm deletion in the dialog

### Viewing Dashboard

- Navigate to **Dashboard** to see:
  - Total products count
  - Total stock quantity
  - Total sales
  - Low stock alerts
  - Category distribution (Pie Chart)
  - Top selling products (Bar Chart)
  - Sales by category (Bar Chart)

### Creating Additional Admins

1. Sign in as an admin
2. Navigate to **Onboard Admin**
3. Fill in the form:
   - Full Name
   - Email Address
   - Password (min 6 characters)
4. Click **Create Admin Account**

---

## 🔌 API Documentation

### Products API

#### Get All Products
```http
GET /api/products?page=1&limit=10&search=query&category=category
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search query (optional)
- `category` - Category filter (optional)

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### Get Single Product
```http
GET /api/products/[id]
```

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "stock": 100,
  "category": "Electronics",
  "sku": "PROD-001",
  "brand": "Brand Name",
  "images": ["url1", "url2"]
}
```

#### Update Product
```http
PUT /api/products/[id]
Content-Type: application/json

{
  // Same as create
}
```

#### Delete Product
```http
DELETE /api/products/[id]
```

### Statistics API

#### Get Dashboard Stats
```http
GET /api/products/stats
```

**Response:**
```json
{
  "totalProducts": 100,
  "totalStock": 5000,
  "totalSales": 2500,
  "lowStockProducts": 5,
  "categoryStats": [...],
  "topProducts": [...]
}
```

### Upload API

#### Upload Image
```http
POST /api/upload
Content-Type: multipart/form-data

file: [image file]
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/..."
}
```

### Admin API

#### Create Admin
```http
POST /api/admin/onboard
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## 🔐 Authentication

### How It Works

1. **Sign In** - Users authenticate with email/password
2. **Session Creation** - NextAuth.js creates a JWT session
3. **Route Protection** - Middleware checks admin role
4. **Access Control** - Only admins can access `/admin/*` routes

### Default Admin Credentials

After running the setup script:
- **Email:** `admin@example.com`
- **Password:** `admin123`

⚠️ **Important:** Change the default password in production!

### Creating Custom Admin

Use the onboarding page at `/admin/onboard` (requires admin access) or run:

```bash
node scripts/create-default-admin.js
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

Update `.env.local` with production values:

```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Deployment Platforms

- **Vercel** (Recommended) - [Deploy Guide](https://vercel.com/docs)
- **Netlify** - [Deploy Guide](https://docs.netlify.com/)
- **AWS** - [Deploy Guide](https://aws.amazon.com/)
- **Docker** - Create a `Dockerfile` for containerized deployment

---

## 🧪 Testing

### Manual Testing Checklist

See `TESTING_GUIDE.md` for comprehensive testing instructions.

### Quick Test

1. ✅ Sign in with default credentials
2. ✅ Create a new product
3. ✅ View products list
4. ✅ Edit a product
5. ✅ Delete a product
6. ✅ View dashboard charts
7. ✅ Upload product images
8. ✅ Create new admin

---

## 📸 Screenshots

### Dashboard
- Real-time statistics
- Interactive charts
- Category distribution
- Top selling products

### Product Management
- Modern card-based layout
- Search and filter
- Pagination
- Quick actions

### Product Form
- Multi-step wizard
- Real-time validation
- Image upload
- Progress indicator

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Add comments for complex logic

---

## 📚 Additional Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing procedures
- **[FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)** - Feature verification
- **[PROJECT_HIGHLIGHTS.md](./PROJECT_HIGHLIGHTS.md)** - Project showcase
- **[UI_IMPROVEMENTS.md](./UI_IMPROVEMENTS.md)** - UI enhancements

---

## 🐛 Troubleshooting

### Common Issues

**Issue: MongoDB connection failed**
- Check `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running (local) or IP is whitelisted (Atlas)

**Issue: NextAuth secret error**
- Generate a new secret: `openssl rand -base64 32`
- Update `NEXTAUTH_SECRET` in `.env.local`

**Issue: Image upload fails**
- Verify Cloudinary credentials
- Check file size (max 5MB)
- Ensure file is an image format

**Issue: Build errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Recharts](https://recharts.org/) - Chart library
- [Cloudinary](https://cloudinary.com/) - Image storage
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## ⭐ Show Your Support

If you find this project helpful, please give it a star on GitHub!

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and MongoDB**

[Report Bug](https://github.com/yourusername/repo/issues) • [Request Feature](https://github.com/yourusername/repo/issues) • [Documentation](./SETUP.md)

</div>
