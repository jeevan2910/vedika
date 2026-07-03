# 🚀 Vedhika Thread Affairs — Go-Live & Deployment Guide

To deploy your premium Next.js boutique website so real customers can access the storefront and you can manage the admin portal, follow these steps.

---

## ⚠️ Important Database Note: Moving from SQLite to PostgreSQL
Currently, your app uses a local database file: **`prisma/dev.db` (SQLite)**. 
- While SQLite is perfect for local development, cloud hosting platforms like **Vercel** use "serverless" hosting.
- Serverless hosts are read-only and reset frequently, meaning if you deploy with SQLite, **all your added products, registered customer numbers, and orders will disappear constantly!**
- To go live, you must use a free cloud SQL database (like **PostgreSQL**). We recommend **[Neon.tech](https://neon.tech/)** or **[Supabase.com](https://supabase.com/)** (both are completely free to start).

---

## 🛠️ Step 1: Create a Free Cloud Database
1. Go to **[Neon.tech](https://neon.tech/)** or **[Supabase](https://supabase.com/)** and create a free account.
2. Create a new project named `vedhika-db`.
3. Copy your database connection string. It will look like this:
   `postgresql://owner:password@ep-cool-water-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`

---

## ⚙️ Step 2: Switch the Code to PostgreSQL
When you are ready to deploy, update your configurations:

1. Open **`prisma/schema.prisma`** and change the database provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Open your **`.env`** file and replace the `DATABASE_URL` line with your new database connection string:
   ```env
   DATABASE_URL="postgresql://owner:password@ep-cool-water-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Run the following command in your terminal to create the tables in your cloud database:
   ```bash
   npx prisma db push
   ```
4. Seed your 21 products into the cloud database:
   ```bash
   node prisma/seed.js
   ```

---

## 📦 Step 3: Push Code to GitHub
1. Create a free account on **[GitHub](https://github.com/)** if you don't have one.
2. Create a **Private Repository** named `vedhika-thread-affairs`.
3. Push your project code from your computer to GitHub by running:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for production deployment"
   git branch -M main
   git remote add origin https://github.com/your-username/vedhika-thread-affairs.git
   git push -u origin main
   ```

---

## 🚀 Step 4: Deploy to Vercel (Free Hosting)
Vercel is the official and fastest hosting platform for Next.js apps.

1. Create a free account on **[Vercel](https://vercel.com/)** and sign in using your GitHub account.
2. Click **Add New** → **Project**.
3. Import your `vedhika-thread-affairs` repository from the list.
4. Expand **Environment Variables** and add the following 3 variables:
   * **`DATABASE_URL`**: *(Your PostgreSQL connection string from Neon/Supabase)*
   * **`ADMIN_USERNAME`**: `vedhika`
   * **`ADMIN_PASSWORD`**: `vedhika@2026`
5. Click **Deploy**!

Vercel will build the website in under 2 minutes and give you a public web link (like `https://vedhika-thread-affairs.vercel.app`) that you can share with customers!

---

## 🔒 Separation of User & Admin (Separate Domains)
To deploy the storefront and the admin portal separately so that customers never see or access the admin path, follow these steps:

1. **Deploy Twice on Vercel**:
   - Create two separate projects in Vercel pointing to the same repository: e.g., `vedhika-storefront` and `vedhika-admin`.
2. **Setup Domains**:
   - Assign your storefront domain (e.g., `vedhikathreadaffairs.com`) to the storefront project.
   - Assign your admin subdomain (e.g., `admin.vedhikathreadaffairs.com`) to the admin project.
3. **Configure Environment Variables**:
   - In both Vercel projects, add the environment variable:
     * **`ADMIN_DOMAIN`**: Set this to your admin domain/subdomain (e.g. `admin.vedhikathreadaffairs.com` or `vedhika-admin.vercel.app`).
   - The system's built-in **Next.js Middleware** will automatically read this variable and:
     * Block all access to `/admin` routes on the public storefront domain (returning a standard `404 Not Found`).
     * Redirect all storefront traffic (like `/`, `/shop`, `/cart`) to `/admin` on the admin domain.
   - For local development on `localhost`, the middleware is bypassed automatically.

