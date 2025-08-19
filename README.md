# 🔗 SHAWTY - URL Shortener

**Making looong links little...**

A modern URL shortening service built with Next.js 15, featuring user authentication and guest access.

## ✨ Features

- 🔐 **User Authentication** (Clerk)
- 🎯 **Guest Access** (4 URL limit)
- 📊 **Click Tracking**
- 📋 **Auto Clipboard Detection**
- 🎨 **Responsive Design**
- ⚡ **Real-time Updates**

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB, Mongoose
- **Auth:** Clerk
- **Validation:** Zod

## 🚀 Quick Start

1. **Clone & Install**

   ```bash
   git clone https://github.com/numaanahmed3110/shawty.git
   cd shawty
   npm install
   ```

2. **Environment Setup**

   ```env
   MONGODB_URI=mongodb://localhost:27017/shawty
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features

- **Guest Users:** 4 URLs max, 7-day expiry
- **Registered Users:** Unlimited URLs
- **Auto-expiry:** Guest URLs deleted after 7 days
- **Session-based:** Guest URLs tied to browser session

## 🚀 Deployment

Deploy on Vercel:

1. Connect GitHub repo
2. Add environment variables
3. Deploy!

---

**Built with ❤️ using Next.js**
