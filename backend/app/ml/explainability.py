import shap
import numpy as np
from .model import get_model, _calculate_symptom_severity

def explain_prediction(patient_data: dict) -> dict:
    """Generate SHAP explanations for a prediction."""
    model = get_model()
    if model is None:
        return {"error": "Model not loaded."}
        
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
    feature_names = [
        'Age', 'Temperature', 'Heart Rate', 'SpO2', 
        'BP Systolic', 'BP Diastolic', 'Respiratory Rate', 'Symptom Severity'
    ]
    
    try:
        # Re-run prediction to get category
        pred_class = model.predict(X)[0]
        if pred_class == 2:
            category = "Critical"
            recommendation = "Immediate medical attention required. Transfer to ER or ICU."
        elif pred_class == 1:
            category = "Urgent"
            recommendation = "Needs evaluation by a physician within 1-2 hours. Prepare for possible intervention."
        else:
            category = "Standard"
            recommendation = "Routine care. Can wait in standard queue."
            
        # Initialize SHAP explainer
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X)
        
        # shap_values could be a list (one for each class) for multi-class classification
        if isinstance(shap_values, list):
            # Use the shap values for the predicted class
            target_shap_values = shap_values[pred_class][0]
        else:
            target_shap_values = shap_values[0]
            
        # Map values to feature names
        factors = []
        for i, name in enumerate(feature_names):
            factors.append({
                "feature": name,
                "value": round(float(features[i]), 2),
                "contribution": float(target_shap_values[i])
            })
            
        # Sort by absolute contribution descending
        factors.sort(key=lambda x: abs(x["contribution"]), reverse=True)
        
        return {
            "factors": factors,
            "recommendation": recommendation
        }
    except Exception as e:
        print(f"Explanation error: {e}")
        return {
            "factors": [],
            "recommendation": "Unable to generate explanation."
        }
