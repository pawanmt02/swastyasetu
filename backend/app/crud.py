from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import database, models

def create_patient(db: Session, patient_data: models.PatientCreate, triage_category: str, risk_score: float) -> database.Patient:
    """Create a new patient record with triage results."""
    db_patient = database.Patient(
        **patient_data.model_dump(),
        triage_category=triage_category,
        risk_score=risk_score
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def get_patients(db: Session, category: str = None) -> list[database.Patient]:
    """Retrieve all patients, optionally filtered by category, ordered by risk score descending."""
    query = db.query(database.Patient)
    if category:
        query = query.filter(database.Patient.triage_category == category)
    return query.order_by(desc(database.Patient.risk_score)).all()

def get_patient_by_id(db: Session, patient_id: int) -> database.Patient | None:
    """Retrieve a specific patient by ID."""
    return db.query(database.Patient).filter(database.Patient.id == patient_id).first()

def get_triage_stats(db: Session) -> dict:
    """Get aggregate counts of patients by triage category."""
    counts = db.query(database.Patient.triage_category).all()
    stats = {"total": len(counts), "critical": 0, "urgent": 0, "standard": 0}
    for (category,) in counts:
        cat_lower = category.lower()
        if cat_lower in stats:
            stats[cat_lower] += 1
    return stats
