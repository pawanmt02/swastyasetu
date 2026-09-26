from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models
from ..database import SessionLocal
from ..ml.model import predict_triage

router = APIRouter(prefix="/api/patients", tags=["patients"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=models.PatientResponse)
def create_patient_endpoint(patient: models.PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient, predict their triage category, and save to DB."""
    try:
        patient_data = patient.model_dump()
        prediction = predict_triage(patient_data)
        
        db_patient = crud.create_patient(
            db=db,
            patient_data=patient,
            triage_category=prediction["category"],
            risk_score=prediction["risk_score"]
        )
        return db_patient
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[models.PatientResponse])
def get_patients_endpoint(category: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all patients, optionally filtered by triage category."""
    try:
        patients = crud.get_patients(db, category=category)
        return patients
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{patient_id}", response_model=models.PatientResponse)
def get_patient_endpoint(patient_id: int, db: Session = Depends(get_db)):
    """Get a specific patient by ID."""
    patient = crud.get_patient_by_id(db, patient_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
