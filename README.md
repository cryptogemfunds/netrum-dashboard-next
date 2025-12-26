# 🚀 Netrum Node Dashboard

A modern **Node Monitoring Dashboard** built with **Next.js**, designed to display real-time network and node information using public APIs — without backend or database.

---

## 🌐 Live Demo

🔗 **https://netrum.nodesafe-app.xyz**

---

## 📦 GitHub Repository

🔗 **https://github.com/cryptogemfunds/netrum-dashboard-next**

---

## ✨ Features

- 📊 Real-time node statistics
- 🔄 Auto-refresh with smart rate limiting
- 🧠 API request caching & timeout handling
- 🚫 No backend, no database
- ⚡ Optimized for performance
- 📱 Fully responsive (desktop & mobile)

---

## 🧱 Tech Stack

| Layer | Technology |
|------|------------|
| Framework | Next.js (App Router) |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS |
| API | REST (fetch with timeout & cache) |
| Hosting | Vercel |


---

## 📁 Project Structure

src/
├── api/
│ └── netrumApi.js # API handler (cache + timeout)
├── features/
│ ├── ActiveNodes.jsx
│ ├── LiteStats.jsx
│ ├── NodeStats.jsx
│ ├── Mining.jsx
│ ├── SystemRequirements.jsx
├── components/
│ ├── Header.jsx
│ ├── Footer.jsx
│ └── Card.jsx
├── app/
│ └── page.tsx


---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone repository
```bash
git clone https://github.com/cryptogemfunds/netrum-dashboard-next.git
cd netrum-dashboard-next

2️⃣ Install dependencies

npm install

3️⃣ Run development server

npm run dev

Open in browser:

http://localhost:3000

🌍 Deploy to Vercel

Push project to GitHub

Go to https://vercel.com

Import repository

Select Next.js framework

Deploy 🚀
