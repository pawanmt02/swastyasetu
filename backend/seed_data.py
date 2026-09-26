import sys
import os
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import PatientCreate
from app.database import Patient
from app.crud import create_patient
from app.ml.model import load_model, predict_triage

# Sample Indian Names
NAMES = [
    "Aarav Patel", "Diya Sharma", "Vihaan Singh", "Anya Gupta",
    "Arjun Kumar", "Myra Desai", "Sai Reddy", "Kiara Joshi",
    "Reyansh Rao", "Priya Iyer", "Rohan Mehta", "Ishita Chawla",
    "Aryan Verma", "Ananya Menon", "Kabir Nair", "Sanya Kapoor",
    "Vivaan Das", "Tara Bose"
]

def seed_database():
    """Seed the database with 18 demo patients."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Loading ML model...")
    load_model()
    
    db = SessionLocal()
    try:
        # Check if DB is already seeded
        if db.query(Patient).count() > 0:
            print("Database already contains data. Skipping seed.")
            return
    except Exception:
        pass # Table might not exist yet or count failed
        
    patients_data = [
        # 6 Critical
        {"name": NAMES[0], "age": 75, "gender": "Male", "temperature": 104.5, "heart_rate": 140, "spo2": 82, "blood_pressure_systolic": 80, "blood_pressure_diastolic": 50, "respiratory_rate": 35, "symptoms": "Severe chest pain, shortness of breath, confusion", "chief_complaint": "Difficulty breathing and chest pain"},
        {"name": NAMES[1], "age": 68, "gender": "Female", "temperature": 103.2, "heart_rate": 135, "spo2": 85, "blood_pressure_systolic": 190, "blood_pressure_diastolic": 110, "respiratory_rate": 30, "symptoms": "Unconscious, high fever", "chief_complaint": "Found unresponsive"},
        {"name": NAMES[2], "age": 82, "gender": "Male", "temperature": 105.0, "heart_rate": 150, "spo2": 78, "blood_pressure_systolic": 75, "blood_pressure_diastolic": 45, "respiratory_rate": 40, "symptoms": "Gasping for air, cyanosis", "chief_complaint": "Severe respiratory distress"},
        {"name": NAMES[3], "age": 55, "gender": "Female", "temperature": 99.0, "heart_rate": 125, "spo2": 88, "blood_pressure_systolic": 210, "blood_pressure_diastolic": 120, "respiratory_rate": 28, "symptoms": "Severe headache, blurred vision, slurred speech", "chief_complaint": "Possible stroke symptoms"},
        {"name": NAMES[4], "age": 45, "gender": "Male", "temperature": 98.6, "heart_rate": 160, "spo2": 90, "blood_pressure_systolic": 85, "blood_pressure_diastolic": 55, "respiratory_rate": 32, "symptoms": "Massive bleeding, pale skin", "chief_complaint": "Trauma, severe hemorrhage"},
        {"name": NAMES[5], "age": 70, "gender": "Female", "temperature": 104.8, "heart_rate": 145, "spo2": 80, "blood_pressure_systolic": 70, "blood_pressure_diastolic": 40, "respiratory_rate": 38, "symptoms": "Lethargy, extremely high fever, no urine output", "chief_complaint": "Septic shock symptoms"},
        
        # 6 Urgent
        {"name": NAMES[6], "age": 35, "gender": "Male", "temperature": 102.5, "heart_rate": 115, "spo2": 92, "blood_pressure_systolic": 155, "blood_pressure_diastolic": 95, "respiratory_rate": 25, "symptoms": "Persistent vomiting, severe abdominal pain", "chief_complaint": "Acute abdomen pain"},
        {"name": NAMES[7], "age": 42, "gender": "Female", "temperature": 101.8, "heart_rate": 110, "spo2": 93, "blood_pressure_systolic": 160, "blood_pressure_diastolic": 100, "respiratory_rate": 24, "symptoms": "Dizziness, palpitation", "chief_complaint": "Irregular heartbeat"},
        {"name": NAMES[8], "age": 60, "gender": "Male", "temperature": 99.5, "heart_rate": 120, "spo2": 91, "blood_pressure_systolic": 90, "blood_pressure_diastolic": 60, "respiratory_rate": 26, "symptoms": "Wheezing, coughing", "chief_complaint": "Asthma exacerbation"},
        {"name": NAMES[9], "age": 28, "gender": "Female", "temperature": 103.0, "heart_rate": 105, "spo2": 94, "blood_pressure_systolic": 110, "blood_pressure_diastolic": 70, "respiratory_rate": 22, "symptoms": "High fever, chills, body ache", "chief_complaint": "Severe flu symptoms"},
        {"name": NAMES[10], "age": 50, "gender": "Male", "temperature": 100.2, "heart_rate": 118, "spo2": 92, "blood_pressure_systolic": 165, "blood_pressure_diastolic": 105, "respiratory_rate": 28, "symptoms": "Moderate chest pain, sweating", "chief_complaint": "Angina"},
        {"name": NAMES[11], "age": 38, "gender": "Female", "temperature": 98.8, "heart_rate": 108, "spo2": 95, "blood_pressure_systolic": 170, "blood_pressure_diastolic": 110, "respiratory_rate": 20, "symptoms": "Severe headache, nausea", "chief_complaint": "Hypertensive crisis"},
        
        # 6 Standard
        {"name": NAMES[12], "age": 25, "gender": "Male", "temperature": 98.6, "heart_rate": 75, "spo2": 98, "blood_pressure_systolic": 120, "blood_pressure_diastolic": 80, "respiratory_rate": 16, "symptoms": "Mild throat pain, runny nose", "chief_complaint": "Common cold"},
        {"name": NAMES[13], "age": 30, "gender": "Female", "temperature": 99.1, "heart_rate": 82, "spo2": 99, "blood_pressure_systolic": 115, "blood_pressure_diastolic": 75, "respiratory_rate": 15, "symptoms": "Mild headache, fatigue", "chief_complaint": "Tension headache"},
        {"name": NAMES[14], "age": 45, "gender": "Male", "temperature": 98.4, "heart_rate": 70, "spo2": 97, "blood_pressure_systolic": 125, "blood_pressure_diastolic": 85, "respiratory_rate": 14, "symptoms": "Joint pain in knee", "chief_complaint": "Chronic knee pain evaluation"},
        {"name": NAMES[15], "age": 22, "gender": "Female", "temperature": 99.5, "heart_rate": 85, "spo2": 98, "blood_pressure_systolic": 110, "blood_pressure_diastolic": 70, "respiratory_rate": 16, "symptoms": "Rash on arms, mild itching", "chief_complaint": "Skin rash"},
        {"name": NAMES[16], "age": 55, "gender": "Male", "temperature": 98.8, "heart_rate": 78, "spo2": 96, "blood_pressure_systolic": 130, "blood_pressure_diastolic": 82, "respiratory_rate": 18, "symptoms": "Heartburn after meals", "chief_complaint": "Acid reflux"},
        {"name": NAMES[17], "age": 40, "gender": "Female", "temperature": 98.2, "heart_rate": 65, "spo2": 100, "blood_pressure_systolic": 118, "blood_pressure_diastolic": 76, "respiratory_rate": 14, "symptoms": "Need medication refill", "chief_complaint": "Routine checkup"}
    ]
    
    count = 0
    for p_data in patients_data:
        try:
            # Predict triage using ML model
            prediction = predict_triage(p_data)
            
            # Create Pydantic model
            patient_create = PatientCreate(**p_data)
            
            # Save to DB
            create_patient(
                db=db,
                patient_data=patient_create,
                triage_category=prediction["category"],
                risk_score=prediction["risk_score"]
            )
            count += 1
            print(f"Added patient: {p_data['name']} - Predicted: {prediction['category']} (Risk: {prediction['risk_score']})")
        except Exception as e:
            print(f"Error adding {p_data['name']}: {e}")
            
    print(f"\nSuccessfully seeded {count} patients into the database.")
    
    db.close()

if __name__ == "__main__":
    # Ensure current directory is in sys.path if running as script
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
    seed_database()
