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
    
    yield
    # Shutdown logic (if any)
    print("Shutting down SwasthyaSetu API...")

app = FastAPI(
    title="SwasthyaSetu - MedTriage AI",
    description="Backend API for AI-powered Medical Triage",
    version="1.0.0",
    lifespan=lifespan
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://localhost:3000'],
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
