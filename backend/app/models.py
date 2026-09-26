from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class PatientCreate(BaseModel):
    """Schema for creating a new patient record."""
    name: str
    age: int
    gender: str
    temperature: float
    heart_rate: int
    spo2: int
    blood_pressure_systolic: int
    blood_pressure_diastolic: int
    respiratory_rate: int
    symptoms: str
    chief_complaint: str

class PatientResponse(PatientCreate):
    """Schema for returning patient data."""
    id: int
    triage_category: str
    risk_score: float
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class TriagePrediction(BaseModel):
    """Schema for returning a triage prediction without saving."""
    category: str
    risk_score: float
    risk_level: str

class RiskFactor(BaseModel):
    """Schema for individual feature contribution to risk score."""
    feature: str
    value: float
    contribution: float

class RiskExplanation(BaseModel):
    """Schema for complete explainability response."""
    patient_id: int
    category: str
    risk_score: float
    factors: List[RiskFactor]
    recommendation: str

class TriageStats(BaseModel):
    """Schema for aggregate triage statistics."""
    total: int
    critical: int
    urgent: int
    standard: int
