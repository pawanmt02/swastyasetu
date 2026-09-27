import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .ml.model import load_model
from .routers import patients, triage

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Loading ML model...")
    load_model()
    
    # Auto-seed on Vercel (since /tmp is empty on cold start)
    if os.environ.get("VERCEL"):
        try:
            from .database import SessionLocal, Patient
            db = SessionLocal()
            if db.query(Patient).count() == 0:
                print("Seeding demo data on Vercel...")
                _seed_demo_data(db)
            db.close()
        except Exception as e:
            print(f"Auto-seed skipped: {e}")
    
    yield
    print("Shutting down SwasthyaSetu API...")

def _seed_demo_data(db):
    """Seed minimal demo data for Vercel deployment."""
    from .database import Patient
    from .ml.model import predict_triage
    import datetime

    demo_patients = [
        {"name": "Aarav Patel", "age": 72, "gender": "Male", "temperature": 103.2, "heart_rate": 130, "spo2": 85, "blood_pressure_systolic": 180, "blood_pressure_diastolic": 110, "respiratory_rate": 28, "symptoms": "Chest Pain, Shortness of Breath", "chief_complaint": "Severe chest pain radiating to left arm"},
        {"name": "Diya Sharma", "age": 65, "gender": "Female", "temperature": 104.0, "heart_rate": 125, "spo2": 88, "blood_pressure_systolic": 170, "blood_pressure_diastolic": 100, "respiratory_rate": 30, "symptoms": "Fever, Shortness of Breath, Fatigue", "chief_complaint": "High fever with difficulty breathing"},
        {"name": "Arjun Kumar", "age": 45, "gender": "Male", "temperature": 100.5, "heart_rate": 105, "spo2": 93, "blood_pressure_systolic": 145, "blood_pressure_diastolic": 92, "respiratory_rate": 22, "symptoms": "Headache, Dizziness, Nausea", "chief_complaint": "Persistent headache with dizziness"},
        {"name": "Anya Gupta", "age": 28, "gender": "Female", "temperature": 98.8, "heart_rate": 78, "spo2": 98, "blood_pressure_systolic": 118, "blood_pressure_diastolic": 76, "respiratory_rate": 16, "symptoms": "Headache", "chief_complaint": "Mild headache since morning"},
        {"name": "Sai Reddy", "age": 55, "gender": "Male", "temperature": 101.0, "heart_rate": 110, "spo2": 91, "blood_pressure_systolic": 155, "blood_pressure_diastolic": 95, "respiratory_rate": 24, "symptoms": "Chest Pain, Fatigue, Cough", "chief_complaint": "Chest tightness with productive cough"},
        {"name": "Priya Iyer", "age": 35, "gender": "Female", "temperature": 99.5, "heart_rate": 88, "spo2": 96, "blood_pressure_systolic": 125, "blood_pressure_diastolic": 82, "respiratory_rate": 18, "symptoms": "Abdominal Pain, Nausea", "chief_complaint": "Stomach pain after meals"},
        {"name": "Rohan Mehta", "age": 50, "gender": "Male", "temperature": 100.8, "heart_rate": 108, "spo2": 92, "blood_pressure_systolic": 150, "blood_pressure_diastolic": 94, "respiratory_rate": 23, "symptoms": "Dizziness, Fatigue, Shortness of Breath", "chief_complaint": "Feeling faint and short of breath"},
        {"name": "Kabir Nair", "age": 22, "gender": "Male", "temperature": 98.4, "heart_rate": 72, "spo2": 99, "blood_pressure_systolic": 115, "blood_pressure_diastolic": 72, "respiratory_rate": 15, "symptoms": "Cough", "chief_complaint": "Dry cough for two days"},
        {"name": "Tara Bose", "age": 40, "gender": "Female", "temperature": 99.0, "heart_rate": 82, "spo2": 97, "blood_pressure_systolic": 120, "blood_pressure_diastolic": 78, "respiratory_rate": 17, "symptoms": "Fever, Fatigue", "chief_complaint": "Low grade fever with body aches"},
    ]

    for p in demo_patients:
        try:
            result = predict_triage(p)
            patient = Patient(
                **p,
                triage_category=result["triage_category"],
                risk_score=result["risk_score"],
            )
            db.add(patient)
        except Exception as e:
            print(f"Skipped {p['name']}: {e}")

    db.commit()
    print(f"Seeded {len(demo_patients)} demo patients.")

app = FastAPI(
    title="SwasthyaSetu - MedTriage AI",
    description="Backend API for AI-powered Medical Triage",
    version="1.0.0",
    lifespan=lifespan
)

# Setup CORS — allow all origins for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patients.router)
app.include_router(triage.router)

@app.get("/")
def read_root():
    return {"message": "SwasthyaSetu API is running", "version": "1.0.0"}

@app.get("/api")
def api_root():
    return {"message": "SwasthyaSetu API is running", "version": "1.0.0"}
