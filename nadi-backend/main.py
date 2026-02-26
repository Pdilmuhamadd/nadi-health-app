from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import datetime
import os

# 1. KONFIGURASI DATABASE
load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise RuntimeError("DATABASE_URL tidak ditemukan di environment variables Railway!")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. SKEMA TABEL
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

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(String, unique=True, index=True)
    full_name = Column(String)
    specialization = Column(String)
    hospital = Column(String)

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
    is_emergency = Column(Integer, default=0) # 0: Normal, 1: SOS ACTIVE
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    patient = relationship("PatientProfile", back_populates="records")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(String)
    receiver_id = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Sinkronisasi Tabel ke Railway
Base.metadata.create_all(bind=engine)

# 3. FASTAPI SETUP
app = FastAPI(title="NADI Health Backend v2.2")

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

# 4. ENDPOINTS REGISTRASI
@app.post("/api/register/patient")
def register_patient(data: dict, db: Session = Depends(get_db)):
    existing = db.query(PatientProfile).filter(PatientProfile.patient_id == data['patient_id']).first()
    if existing:
        raise HTTPException(status_code=400, detail="ID Pasien sudah terdaftar")
    
    new_patient = PatientProfile(
        patient_id=data['patient_id'],
        full_name=data['full_name'],
        age=data.get('age'),
        domicile=data.get('domicile', "Serang, Banten"),
        rpd=data.get('rpd'),
        rpk=data.get('rpk'),
        rpo=data.get('rpo')
    )
    db.add(new_patient)
    db.commit()
    return {"status": "success", "message": f"Pasien {data['full_name']} berhasil didaftarkan"}

@app.post("/api/register/doctor")
def register_doctor(data: dict, db: Session = Depends(get_db)):
    new_doctor = DoctorProfile(
        doctor_id=data['doctor_id'],
        full_name=data['full_name'],
        specialization=data.get('specialization'),
        hospital=data.get('hospital')
    )
    db.add(new_doctor)
    db.commit()
    return {"status": "success", "message": f"Dokter {data['full_name']} berhasil didaftarkan"}

# 5. ENDPOINTS REKAM MEDIS & EMERGENCY SOS
@app.post("/api/records")
async def create_record(data: dict, db: Session = Depends(get_db)):
    status_alert = "Normal"
    blood_sugar = data.get('blood_sugar', 0)
    if blood_sugar > 200:
        status_alert = "Danger (Hyperglycemia)"
    elif blood_sugar < 70:
        status_alert = "Warning (Hypoglycemia)"

    new_record = HealthRecord(
        patient_id=data['patient_id'],
        blood_sugar=blood_sugar,
        sugar_type=data.get('sugar_type'),
        systolic=data.get('systolic'),
        diastolic=data.get('diastolic'),
        rps=data.get('rps'),
        mood_journal=data.get('mood_journal'),
        ai_status="Analisis Stabil",
        medical_alert=status_alert,
        is_emergency=0
    )
    db.add(new_record)
    db.commit()
    return {"status": "success", "alert": status_alert}

@app.post("/api/emergency")
def trigger_emergency(data: dict, db: Session = Depends(get_db)):
    # Trigger sinyal SOS darurat
    new_sos = HealthRecord(
        patient_id=data['patient_id'],
        is_emergency=1,
        medical_alert="EMERGENCY SOS TRIGGERED",
        mood_journal="PENGGUNA MENEKAN TOMBOL DARURAT SOS!",
        ai_status="CRITICAL ALERT"
    )
    db.add(new_sos)
    db.commit()
    return {"status": "sos_sent", "message": "Sinyal darurat telah dikirim ke dokter"}

@app.get("/api/patients")
def get_all_patients(db: Session = Depends(get_db)):
    return db.query(PatientProfile).all()

@app.get("/api/patients/{patient_id}")
def get_patient_profile(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(PatientProfile).filter(PatientProfile.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
    return patient

# 6. ENDPOINTS CHAT
@app.post("/api/chat/send")
def send_message(data: dict, db: Session = Depends(get_db)):
    new_msg = ChatMessage(
        sender_id=data['sender_id'],
        receiver_id=data['receiver_id'],
        message=data['message']
    )
    db.add(new_msg)
    db.commit()
    return {"status": "sent"}

@app.get("/api/chat/{user_id}")
def get_messages(user_id: str, db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(
        (ChatMessage.sender_id == user_id) | (ChatMessage.receiver_id == user_id)
    ).order_by(ChatMessage.created_at.asc()).all()
    return messages

# 7. RUN SERVER
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)