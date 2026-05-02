# 🤖 HireReady — AI-Powered Interview Preparation App

> An intelligent full-stack web application that analyzes your resume and job description using Google Gemini AI to generate personalized interview preparation reports and ATS-friendly tailored resumes.

🔗 **Live Demo:** [gen-ai-project-ovqt.vercel.app](https://gen-ai-project-ovqt.vercel.app/)  
📁 **GitHub:** [github.com/tripathi116/GEN-AI-project](https://github.com/tripathi116/GEN-AI-project)

---

## ✨ Features

- 🔐 **User Authentication** — Secure register/login with JWT and HTTP-only cookies
- 📄 **Resume Upload** — Upload your resume in PDF format
- 🤖 **AI Interview Report** — Google Gemini AI analyzes your resume and job description to generate:
  - Match Score (0-100)
  - Technical Questions with intentions and answers
  - Behavioral Questions with intentions and answers
  - Skill Gaps with severity levels (Low / Medium / High)
  - Day-wise Preparation Plan
- 📥 **Tailored Resume Download** — AI rewrites your resume to match the job description and generates an ATS-friendly PDF
- 📋 **Recent Interview Plans** — View all your previously generated reports

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- SCSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (File Upload)
- PDF Parse
- Puppeteer (PDF Generation)

### AI
- Google Gemini AI (`gemini-3-flash-preview`)

### Deployment
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → MongoDB Atlas

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- Google Gemini API Key

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/tripathi116/GEN-AI-project
cd GEN-AI-project
```

**2. Install Backend dependencies:**
```bash
cd BACKEND
npm install
```

**3. Install Frontend dependencies:**
```bash
cd FRONTEND
npm install
```

**4. Create `.env` file in BACKEND folder:**
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
PORT=3000
```

**5. Run Backend:**
```bash
cd BACKEND
npm run dev
```

**6. Run Frontend:**
```bash
cd FRONTEND
npm run dev
```

---

## 📁 Project Structure

```
GEN-AI-project/
├── FRONTEND/
│   └── src/
│       ├── features/
│       │   ├── auth/
│       │   │   ├── components/
│       │   │   ├── hooks/
│       │   │   ├── pages/
│       │   │   └── services/
│       │   └── interview/
│       │       ├── hooks/
│       │       ├── pages/
│       │       └── services/
│       └── App.jsx
└── BACKEND/
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── services/
        └── middlewares/
```

---

## 🔄 How It Works

```
User uploads Resume + Job Description + Self Description
                        ↓
        Google Gemini AI analyzes everything
                        ↓
    Generates personalized Interview Report
                        ↓
    User can download ATS-friendly Tailored Resume
```

---

## 👨‍💻 Developer

**Shashank Tripathi**  
GitHub: [@tripathi116](https://github.com/tripathi116)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
