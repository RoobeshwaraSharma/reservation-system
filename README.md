# New Shop - Computer Repair Shop Tickets Management

New Shop is a **full-stack e-commerce platform** built with Next.js, leveraging a modern stack for authentication, database management, UI components, and API handling.

## 🚀 Tech Stack

### Frontend
- **Next.js** (v15.1.6)
- **React** (v19.0.0)
- **shadcn/ui** components
- **react-hook-form** for form validation
- **@tanstack/react-table** for tables
- **Tailwind CSS** for styling

### Backend
- **Next.js API routes** for server-side logic
- **next-safe-action** for secure server-client requests
- **Drizzle ORM** for database interactions
- **Neon Database** (PostgreSQL, serverless)

### Authentication & Authorization
- **Kinde** for authentication
- **Kinde Management API** for user roles and permission management

### Dev & Tooling
- **ESLint** & **TypeScript** for code quality
- **Drizzle Kit** for database migrations
- **Vercel Analytics** for performance insights

## 📂 Project Structure
```
new-shop/
│-- src/
│   ├── components/   # UI components (shadcn/ui)
│   ├── pages/        # Next.js pages
│   ├── db/           # Database config & migrations (Drizzle ORM)
│   ├── utils/        # Helper functions
│-- public/           # Static assets
│-- .env.local        # Environment variables (local dev)
│-- package.json      # Dependencies & scripts
│-- tailwind.config.js # Tailwind CSS configuration
```

## 🛠 Setup & Installation

### Prerequisites
- **Node.js v18+**
- **NPM or Yarn**
- **Neon Database account** ([Sign up here](https://console.neon.tech/))
- **Kinde account** ([Docs](https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/))

### Installation
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo/new-shop.git
   cd new-shop
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up environment variables**
   Create a `.env.local` file in the root folder and add the following variables:
   ```sh
   KINDE_CLIENT_ID=
   KINDE_CLIENT_SECRET=
   KINDE_ISSUER_URL=
   KINDE_SITE_URL=http://localhost:3000
   KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
   KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/tickets
   
   DATABASE_URL=
   
   KINDE_DOMAIN=
   KINDE_MANAGEMENT_CLIENT_ID=
   KINDE_MANAGEMENT_CLIENT_SECRET=
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

## ⚙️ Available Scripts

### Development
```sh
npm run dev   # Start the Next.js dev server
npm run build # Build the project for production
npm run start # Start the production server
npm run lint  # Run ESLint
```

### Database
```sh
npm run db:generate # Generate database schema using Drizzle ORM
npm run db:migrate  # Run database migrations
```

## 🔗 Resources
- **Kinde Documentation**: [https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/](https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/)
- **Neon Database Console**: [https://console.neon.tech/](https://console.neon.tech/)

## 📌 License
This project is licensed under the MIT License.


