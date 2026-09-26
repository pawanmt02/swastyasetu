import os
import joblib
import numpy as np

_model = None

def load_model():
    """Load the trained triage model into memory."""
    global _model
    model_path = os.path.join(os.path.dirname(__file__), 'triage_model.pkl')
    try:
        _model = joblib.load(model_path)
        print("ML model loaded successfully.")
    except Exception as e:
        print(f"Failed to load ML model: {e}")

def get_model():
    """Retrieve the loaded ML model."""
    if _model is None:
        load_model()
    return _model

def _calculate_symptom_severity(symptoms: str) -> int:
    """Derive a symptom severity score from the symptoms string."""
    if not symptoms:
        return 1
    symptom_list = [s.strip() for s in symptoms.split(',') if s.strip()]
    count = len(symptom_list)
    if count <= 1:
        return 1
    elif count <= 3:
        return 2
    else:
        return 3

def predict_triage(patient_data: dict) -> dict:
    """Predict the triage category and risk score for a patient."""
    model = get_model()
    if model is None:
        # Fallback if model fails to load
        return {"category": "Standard", "risk_score": 0.0, "risk_level": "Low"}
        
    sym_sev = _calculate_symptom_severity(patient_data.get('symptoms', ''))
    
    features = [
        patient_data.get('age', 0),
        patient_data.get('temperature', 98.6),
        patient_data.get('heart_rate', 80),
        patient_data.get('spo2', 98),
        patient_data.get('blood_pressure_systolic', 120),
        patient_data.get('blood_pressure_diastolic', 80),
        patient_data.get('respiratory_rate', 16),
        sym_sev
    ]
    
    X = np.array([features])
    
    try:
        pred_class = model.predict(X)[0]
        probs = model.predict_proba(X)[0]
        
        # Calculate risk score based on probability of the predicted class or higher classes
        # A simpler way is to weight the probabilities
        # risk_score = probs[0]*10 + probs[1]*50 + probs[2]*90
        
        # Or just use the highest probability scaled appropriately
        if pred_class == 2:
            category = "Critical"
            risk_level = "High"
            risk_score = 75.0 + (probs[2] * 25.0)
        elif pred_class == 1:
            category = "Urgent"
            risk_level = "Medium"
            risk_score = 40.0 + (probs[1] * 34.9)
        else:
            category = "Standard"
            risk_level = "Low"
            risk_score = probs[0] * 39.9
            
        return {
            "category": category,
            "risk_score": round(min(100.0, max(0.0, risk_score)), 1),
            "risk_level": risk_level
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        return {"category": "Standard", "risk_score": 0.0, "risk_level": "Low"}
