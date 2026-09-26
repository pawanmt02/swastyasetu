import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def generate_synthetic_data(n_samples: int = 1500) -> pd.DataFrame:
    """
    Generate synthetic patient data with realistic vital sign distributions
    for different triage categories.
    """
    np.random.seed(42)
    data = []
    
    samples_per_class = n_samples // 3
    
    # Critical (Label 2)
    for _ in range(samples_per_class):
        age = np.random.randint(40, 90)
        temp = np.random.uniform(103, 106)
        hr = np.random.randint(120, 180)
        spo2 = np.random.randint(70, 89)
        bp_sys = np.random.choice([np.random.randint(60, 86), np.random.randint(180, 221)])
        bp_dia = bp_sys - np.random.randint(20, 50)
        rr = np.random.randint(28, 46)
        sym_sev = np.random.randint(2, 4) # 2 or 3
        data.append([age, temp, hr, spo2, bp_sys, bp_dia, rr, sym_sev, 2])
        
    # Urgent (Label 1)
    for _ in range(samples_per_class):
        age = np.random.randint(20, 80)
        temp = np.random.uniform(100, 103)
        hr = np.random.randint(100, 131)
        spo2 = np.random.randint(89, 94)
        bp_sys = np.random.choice([np.random.randint(85, 101), np.random.randint(150, 181)])
        bp_dia = bp_sys - np.random.randint(30, 50)
        rr = np.random.randint(22, 31)
        sym_sev = np.random.randint(1, 4) # 1, 2, or 3
        data.append([age, temp, hr, spo2, bp_sys, bp_dia, rr, sym_sev, 1])

    # Standard (Label 0)
    for _ in range(samples_per_class):
        age = np.random.randint(18, 65)
        temp = np.random.uniform(96, 99.5)
        hr = np.random.randint(60, 101)
        spo2 = np.random.randint(94, 101)
        bp_sys = np.random.randint(100, 141)
        bp_dia = np.random.randint(60, 90)
        rr = np.random.randint(12, 23)
        sym_sev = np.random.randint(1, 3) # 1 or 2
        data.append([age, temp, hr, spo2, bp_sys, bp_dia, rr, sym_sev, 0])
        
    columns = ['age', 'temperature', 'heart_rate', 'spo2', 'bp_systolic', 'bp_diastolic', 'respiratory_rate', 'symptom_severity', 'label']
    df = pd.DataFrame(data, columns=columns)
    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    return df

def train_model():
    """Train the gradient boosting classifier and save it."""
    print("Generating synthetic patient data...")
    df = generate_synthetic_data(1500)
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Gradient Boosting Classifier...")
    model = GradientBoostingClassifier(n_estimators=200, max_depth=5, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred, target_names=['Standard', 'Urgent', 'Critical']))
    
    model_path = os.path.join(os.path.dirname(__file__), 'triage_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model()
