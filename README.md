# VectraHire

VectraHire is a clean, production-ready resume analysis dashboard built with:

- Vite + React
- Tailwind CSS
- React Router
- Axios
- Context API (authentication)

## Features

- Register and login flows with JWT token storage in `localStorage`
- Protected routes and logout
- Dashboard metrics:
  - Total resumes analyzed
  - Average ATS score
  - Recent activity
- Resume analyzer:
  - Resume file upload
  - Simulated analysis API call
  - ATS score, keyword match, and suggestions
- Analysis history table

## Project Structure

```text
src/
 ├── api/
 │    └── apiClient.js
 ├── context/
 │    └── AuthContext.jsx
 ├── components/
 │    ├── layout/
 │    │     ├── Sidebar.jsx
 │    │     └── Layout.jsx
 │    ├── dashboard/
 │    │     └── StatCard.jsx
 │    └── resume/
 │          └── ResumeUpload.jsx
 ├── pages/
 │    ├── Dashboard.jsx
 │    ├── ResumeAnalyzer.jsx
 │    ├── History.jsx
 │    ├── Login.jsx
 │    └── Register.jsx
 ├── App.jsx
 ├── main.jsx
 └── index.css
```

## Environment Variables

Create a `.env` file (see `.env.example`):

```bash
VITE_API_URL=https://api.your-domain.com
```

## Run Locally

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```
