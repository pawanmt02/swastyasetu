import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./triage.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Patient(Base):
    """
    SQLAlchemy ORM model for Patient data.
    """
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), index=True)
    age = Column(Integer)
    gender = Column(String(10))
    temperature = Column(Float)
    heart_rate = Column(Integer)
    spo2 = Column(Integer)
    blood_pressure_systolic = Column(Integer)
    blood_pressure_diastolic = Column(Integer)
    respiratory_rate = Column(Integer)
    symptoms = Column(String(500))
    chief_complaint = Column(String(200))
    triage_category = Column(String(20), index=True)
    risk_score = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
