from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, models
from ..database import SessionLocal
from ..ml.model import predict_triage
from ..ml.explainability import explain_prediction

router = APIRouter(prefix="/api/triage", tags=["triage"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/predict", response_model=models.TriagePrediction)
def predict_triage_endpoint(patient: models.PatientCreate):
    """Predict triage category for patient data without saving to DB."""
    try:
        prediction = predict_triage(patient.model_dump())
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/explain/{patient_id}", response_model=models.RiskExplanation)
def explain_triage_endpoint(patient_id: int, db: Session = Depends(get_db)):
    """Get SHAP explainability for a specific patient's triage prediction."""
    patient = crud.get_patient_by_id(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    try:
        # Convert ORM object to dict for ML function
        patient_dict = {
            "age": patient.age,
            "temperature": patient.temperature,
            "heart_rate": patient.heart_rate,
            "spo2": patient.spo2,
            "blood_pressure_systolic": patient.blood_pressure_systolic,
            "blood_pressure_diastolic": patient.blood_pressure_diastolic,
            "respiratory_rate": patient.respiratory_rate,
            "symptoms": patient.symptoms
        }
        
        explanation = explain_prediction(patient_dict)
        
        return {
            "patient_id": patient.id,
            "category": patient.triage_category,
            "risk_score": patient.risk_score,
            "factors": explanation.get("factors", []),
            "recommendation": explanation.get("recommendation", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats", response_model=models.TriageStats)
def get_triage_stats_endpoint(db: Session = Depends(get_db)):
    """Get aggregate statistics of patients across triage categories."""
    try:
        stats = crud.get_triage_stats(db)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
