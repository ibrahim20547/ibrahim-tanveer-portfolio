# Ibrahim Tanveer — Portfolio Website

A personal portfolio website for **Ibrahim Tanveer** (AI Web App Developer & Full-Stack Web Creator).

Built with:
- **Frontend:** React.js, Vite, Vanilla CSS Design System, Lucide Icons
- **Backend:** Python, Flask, REST APIs, Flask-CORS
- **Database:** SQLite (`portfolio.db`)

---

## Features

- **Minimalist, High-End SaaS Aesthetic:** Clean typography (Inter & Outfit), subtle borders, soft shadows, and muted blue accents.
- **Dual Theme Support:** Smooth switching between Dark Mode (default) and Light Mode with persistence in `localStorage`.
- **6 Featured Projects:**
  1. **AI Web Platform** (Multi-tool Generative AI suite)
  2. **BookVerse** (Full-Stack Digital Library & Management Platform)
  3. **Lumina** (Interactive Supercar Showcase & AI Car Match)
  4. **Electrotech Store** (Modern Electronics E-Commerce & Admin Inventory Hub)
  5. **Real Assistant** (Pakistan-focused Real Estate Discovery & Mapping)
  6. **AI House Designer** (3D Spatial Planning & Architectural Concept Engine)
- **Interactive Project Modals:** In-depth case studies displaying project overview, problem statement, architectural solution, feature breakdowns, and technology badges.
- **Dynamic Contact Form:** Direct integration with the Flask backend API and SQLite database to persist inquiries with instant UI feedback.
- **Responsive Architecture:** Fully optimized for desktop, tablet, and mobile with a custom hamburger navigation drawer.
- **Strict Compliance:** No fake statistics, awards, certifications, or clients. No admin panel links in the navigation or footer.

---

## Quick Start

### 1. Start the Flask Backend (Terminal 1)
```powershell
cd backend
python app.py
```
The backend runs on `http://127.0.0.1:5000`.

### 2. Start the React Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```
The frontend runs on `http://localhost:5173`.
All `/api/*` calls are automatically proxied to the Flask server.
