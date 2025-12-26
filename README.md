# Netrum Node Dashboard

Frontend-only Node Dashboard built with **Next.js (latest)** to visualize Netrum node data using public APIs.

**Live Demo:** https://netrum.nodesafe-app.xyz  
**GitHub Repository:** https://github.com/cryptogemfunds/netrum-dashboard-next

---

## ✨ Features

- Built with **Next.js (latest version)**
- Frontend-only (no backend, no database)
- API integration with **30-second timeout per request**
- Live node statistics:
  - Lite Stats
  - Active Nodes
  - Node Stats
  - Tasks & Mining
  - Balance
- Graceful handling when APIs are slow or unreachable
- Clean UI with NetrumLabs / Base-style branding
- Deployed on **Vercel**
- Custom **.xyz domain**

---

## 🧱 Tech Stack

- Framework: Next.js
- Language: JavaScript / TypeScript
- Styling: Tailwind CSS
- Deployment: Vercel


---

## ⏱ API Timeout

All API requests are configured with a **30-second timeout**.

If an API does not respond within the timeout:
- The request fails safely
- The UI displays a fallback state instead of crashing

A manual API timeout test is available directly in the dashboard UI.

---

## 🌐 Deployment & Domain

- Hosting: Vercel
- Domain: `netrum.nodesafe-app.xyz`

---

## 📦 Local Development

```bash
git clone https://github.com/cryptogemfunds/netrum-dashboard-next.git
cd netrum-dashboard-next
npm install
npm run dev
