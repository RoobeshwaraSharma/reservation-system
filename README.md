# Serenity Hotel - Hotel Reservation Management System

Serenity Hotel is a **comprehensive hotel reservation and management system** built with Next.js, featuring modern authentication, payment processing, room management, and customer service capabilities.

## 🏨 Key Features

### 🎯 Core Functionality

- **Room Management**: Create, update, and manage room inventory with different types (Standard, Deluxe, Suite)
- **Reservation System**: Complete booking workflow with check-in/check-out management
- **Customer Management**: Customer database with search and profile management
- **Payment Processing**: Integrated Stripe payment gateway with webhook handling
- **Service Management**: Additional services booking and assignment
- **Reports & Analytics**: Daily occupancy, financial, and room status reports
- **Travel Company Support**: Bulk booking capabilities for travel agencies

### 🔐 User Roles & Permissions

- **Customer Portal**: Self-service booking and account management
- **Employee Access**: Check-in/check-out, room assignment, service management
- **Manager Access**: Full system access including reports and analytics
- **Role-based Authentication**: Secure access control with Kinde Auth

### 💳 Payment Features

- **Stripe Integration**: Secure online payment processing
- **Multiple Payment Methods**: Card, bank transfer, and other payment options
- **Payment Tracking**: Real-time payment status updates
- **Billing Management**: Automated bill generation and payment tracking

### 📊 Reporting & Analytics

- **Daily Occupancy Reports**: Track room utilization
- **Financial Reports**: Revenue and payment analytics
- **Room Status Reports**: Real-time room availability and status
- **Customer Analytics**: Booking patterns and customer insights

## 🚀 Tech Stack

### Frontend

- **Next.js** (v15.5.2) - React framework with App Router
- **React** (v19.1.1) - UI library
- **TypeScript** (v5) - Type safety
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** (v0.474.0) - Icon library
- **React Hook Form** (v7.54.2) - Form management
- **@tanstack/react-table** (v8.21.2) - Data tables
- **Next Themes** (v0.4.4) - Dark/light mode support

### Backend & Database

- **Next.js API Routes** - Server-side logic
- **Drizzle ORM** (v0.39.2) - Type-safe database queries
- **Neon Database** (v0.10.4) - Serverless PostgreSQL
- **next-safe-action** (v7.10.4) - Secure server actions
- **Zod** (v3.24.1) - Schema validation

### Authentication & Payments

- **Kinde Auth** (v2.5.0) - Authentication and authorization
- **Kinde Management API** (v0.12.0) - User management
- **Stripe** (v18.2.1) - Payment processing

### Development Tools

- **ESLint** (v9) - Code linting
- **Drizzle Kit** (v0.31.1) - Database migrations
- **Vercel Analytics** (v1.5.0) - Performance monitoring
- **Sonner** (v2.0.1) - Toast notifications

## 📂 Project Structure

```
reservation-system/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (rs)/              # Reservation System routes
│   │   │   ├── cico/          # Check-in/Check-out
│   │   │   ├── customers/     # Customer management
│   │   │   ├── reservations/  # Reservation management
│   │   │   ├── rooms/         # Room management
│   │   │   ├── services/      # Service management
│   │   │   ├── reports/       # Analytics & reports
│   │   │   └── tickets/       # Support tickets
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── stripe-webhook/ # Payment webhooks
│   │   │   └── reports/       # Report APIs
│   │   └── actions/           # Server actions
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   └── inputs/           # Form input components
│   ├── db/                   # Database configuration
│   │   ├── schema.ts         # Database schema
│   │   └── migrations/       # Database migrations
│   ├── lib/                  # Utility functions
│   │   ├── queries/          # Database queries
│   │   └── utils/            # Helper functions
│   └── zod-schemas/          # Validation schemas
├── public/                   # Static assets
│   └── images/              # Hotel images
└── data/                    # Sample data
```

## 🛠 Setup & Installation

### Prerequisites

- **Node.js v18+**
- **NPM or Yarn**
- **Neon Database account** ([Sign up here](https://console.neon.tech/))
- **Kinde account** ([Docs](https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/))
- **Stripe account** ([Sign up here](https://stripe.com/))

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo/reservation-system.git
   cd reservation-system
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up environment variables**
   Create a `.env.local` file in the root folder and add the following variables:

   ```sh
   # Database Configuration
   DATABASE_URL=your_neon_database_url

   # Kinde Authentication
   KINDE_CLIENT_ID=your_kinde_client_id
   KINDE_CLIENT_SECRET=your_kinde_client_secret
   KINDE_ISSUER_URL=https://your-domain.kinde.com
   KINDE_SITE_URL=http://localhost:3000
   KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
   KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/reservations

   # Kinde Management API
   KINDE_DOMAIN=your-domain.kinde.com
   KINDE_MANAGEMENT_CLIENT_ID=your_management_client_id
   KINDE_MANAGEMENT_CLIENT_SECRET=your_management_client_secret

   # Stripe Payment Processing
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # Application URLs
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```sh
   npm run dev
   ```
   The app should now be running at [http://localhost:3000](http://localhost:3000)

### Database Setup

1. **Generate database schema (Drizzle Kit)**
   ```sh
   npm run db:generate
   ```
2. **Run database migrations**
   ```sh
   npm run db:migrate
   ```

### Stripe Webhook Setup

1. **Create a webhook endpoint** in your Stripe dashboard
2. **Set the endpoint URL** to: `https://your-domain.com/api/stripe-webhook`
3. **Select events**: `checkout.session.completed`
4. **Copy the webhook secret** and add it to your `.env.local` file

## ⚙️ Available Scripts

### Development

```sh
npm run dev      # Start the Next.js dev server with Turbopack
npm run build    # Build the project for production
npm run start    # Start the production server
npm run lint     # Run ESLint
```

### Database

```sh
npm run db:generate # Generate database schema using Drizzle ORM
npm run db:migrate  # Run database migrations
```

## 🏨 System Features

### Customer Features

- **Online Booking**: Easy reservation system with real-time availability
- **Account Management**: Personal dashboard with booking history
- **Payment Processing**: Secure online payments via Stripe
- **Service Requests**: Additional services booking (spa, restaurant, etc.)

### Staff Features

- **Check-in/Check-out**: Streamlined guest arrival and departure
- **Room Assignment**: Dynamic room allocation based on availability
- **Service Management**: Assign and track additional services
- **Customer Support**: Ticket system for guest inquiries

### Management Features

- **Analytics Dashboard**: Comprehensive reporting and insights
- **Revenue Tracking**: Financial reports and payment analytics
- **Occupancy Reports**: Room utilization and booking patterns
- **User Management**: Staff role and permission management

## 🔐 User Roles

### Customer

- Create and manage reservations
- View booking history
- Make payments
- Request additional services

### Employee

- Process check-ins and check-outs
- Assign rooms to reservations
- Manage service requests
- Handle customer inquiries

### Manager

- Access all employee features
- View comprehensive reports
- Manage room inventory
- Oversee financial operations

## 🗄️ Database Schema

The system uses PostgreSQL with the following main entities:

- **Customers**: Guest information and contact details
- **Rooms**: Room inventory with types, rates, and availability
- **Reservations**: Booking records with check-in/out dates
- **Reservation Rooms**: Room assignments for bookings
- **Services**: Additional services offered by the hotel
- **Bills**: Financial records for each reservation
- **Payments**: Payment tracking and status
- **Tickets**: Customer support and service requests

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment with database
- **DigitalOcean**: App Platform deployment

## 🔗 Resources & Documentation

### External Services

- **Kinde Auth**: [Documentation](https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/)
- **Stripe Payments**: [Documentation](https://stripe.com/docs)
- **Neon Database**: [Console](https://console.neon.tech/)
- **Drizzle ORM**: [Documentation](https://orm.drizzle.team/)

### UI Components

- **shadcn/ui**: [Component Library](https://ui.shadcn.com/)
- **Tailwind CSS**: [Documentation](https://tailwindcss.com/)
- **Lucide Icons**: [Icon Library](https://lucide.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation links above
