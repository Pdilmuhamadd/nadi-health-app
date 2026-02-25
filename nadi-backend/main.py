from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy import create_engine
import datetime
import os

# 1. KONFIGURASI DATABASE
load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. SKEMA TABEL (NORMALISASI)
class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, unique=True, index=True)
    full_name = Column(String)
    age = Column(Integer)
    domicile = Column(String, default="Serang, Banten")
    
    rpd = Column(Text)
    rpk = Column(Text)
    rpo = Column(Text)
    
    records = relationship("HealthRecord", back_populates="patient")

class HealthRecord(Base):
    __tablename__ = "health_records"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey('patient_profiles.patient_id'))
    
    blood_sugar = Column(Integer)
    sugar_type = Column(String) 
    systolic = Column(Integer)
    diastolic = Column(Integer)
    insulin_unit = Column(Integer)
    
    rps = Column(Text) 
    mood_journal = Column(Text)
    ai_status = Column(String) 
    medical_alert = Column(String)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    patient = relationship("PatientProfile", back_populates="records")

Base.metadata.create_all(bind=engine)

# 3. FASTAPI SETUP
app = FastAPI(title="NADI Health Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 4. ENDPOINTS
@app.get("/api/health-check")
def health_check():
    return {"status": "online", "database": "connected to PostgreSQL"}

@app.get("/api/seed-profile")
def seed_profile(db: Session = Depends(get_db)):
    existing = db.query(PatientProfile).filter(PatientProfile.patient_id == "fadhil-01").first()
    if not existing:
        new_profile = PatientProfile(
            patient_id="fadhil-01",
            full_name="Fadhil Muhamad Pratama",
            age=22,
            domicile="Serang, Banten",
            rpd="Diabetes Tipe 1 sejak 2024",
            rpk="Keluarga ada riwayat DM",
            rpo="Metformin, Novorapid"
        )
        db.add(new_profile)
        db.commit()
        return {"message": "Profil Fadhil berhasil dibuat"}
    return {"message": "Profil sudah ada"}

@app.post("/api/records")
async def create_record(data: dict, db: Session = Depends(get_db)):
    status_alert = "Normal"
    if data['blood_sugar'] > 200:
        status_alert = "Danger"
    elif data['blood_sugar'] < 70:
        status_alert = "Warning (Hypoglycemia)"

    new_record = HealthRecord(
        patient_id=data['patient_id'],
        blood_sugar=data['blood_sugar'],
        sugar_type=data['sugar_type'],
        systolic=data.get('systolic'),
        diastolic=data.get('diastolic'),
        insulin_unit=data.get('insulin_unit'),
        rps=data.get('rps'),
        mood_journal=data.get('mood_journal'),
        ai_status="Stabil (Default)",
        medical_alert=status_alert
    )
    
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return {"status": "success", "alert": status_alert}

@app.get("/api/patients")
def get_all_patients(db: Session = Depends(get_db)):
    results = db.query(PatientProfile).all()
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)