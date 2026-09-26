# 🏥 SwasthyaSetu — MedTriage AI

**Predictive Patient Triage Dashboard for Emergency Departments**

SwasthyaSetu (स्वास्थ्यसेतु) is a web-based patient triage system that uses machine learning to automatically prioritize patients in emergency rooms. It translates complex predictive ML data into a low-friction, accessible Kanban interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-green.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)

## ✨ Features

- **🔴🟡🟢 Kanban Triage Board** — Patients auto-sorted into Critical, Urgent, and Standard columns
- **🤖 AI Risk Scoring** — Gradient Boosting model predicts triage level from vital signs
- **📊 Explainable AI** — SHAP-powered risk breakdown shows *why* a patient was flagged
- **🎤 Voice-to-Text** — Hands-free symptom entry via Web Speech API
- **🌐 Multilingual** — Instant toggle between English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ)
- **📱 Touch-Friendly** — Large touch targets designed for tablet use in ER environments

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python FastAPI |
| Database | SQLite (SQLAlchemy ORM) |
| ML Model | scikit-learn (Gradient Boosting) |
| Explainability | SHAP (TreeExplainer) |
| i18n | react-i18next |
| Voice Input | Web Speech API |

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Train the ML model
python -m app.ml.train

# Seed demo data
python seed_data.py

# Start the API server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 📁 Project Structure

```
swastyasetu/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── main.py          # FastAPI application entry
│   │   ├── database.py      # SQLite + SQLAlchemy
│   │   ├── models.py        # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   ├── routers/         # API route handlers
│   │   └── ml/              # ML model, training, SHAP
│   ├── requirements.txt
│   └── seed_data.py         # Demo data seeder
│
├── frontend/                # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page views
│   │   ├── i18n/            # Translations (EN/HI/KN)
│   │   └── services/        # API client
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patients` | List all patients |
| `POST` | `/api/patients` | Create patient + auto-triage |
| `GET` | `/api/patients/{id}` | Get patient details |
| `POST` | `/api/triage/predict` | Predict triage (without saving) |
| `GET` | `/api/triage/explain/{id}` | SHAP risk explanation |
| `GET` | `/api/triage/stats` | ER load statistics |

## 🌐 Supported Languages

| Language | Code | Script |
|----------|------|--------|
| English | `en` | Latin |
| Hindi | `hi` | देवनागरी |
| Kannada | `kn` | ಕನ್ನಡ |

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.
