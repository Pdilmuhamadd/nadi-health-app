export const MOCK_PATIENT_DATA = {
  id: "pasien123",
  full_name: "Darmawan Priyanto",
  age: 45,
  domicile: "Serang, Banten",
  rpd: "Hipertensi sejak 2020",
  rpk: "Diabetes Melitus (Ayah)",
  rpo: "Amlodipine 5mg",
  records: [
    { blood_sugar: 120, systolic: 110, diastolic: 70, created_at: "2024-03-10T08:00:00Z", ai_analysis: "Kondisi Stabil" },
    { blood_sugar: 145, systolic: 120, diastolic: 80, created_at: "2024-03-11T08:00:00Z", ai_analysis: "Gula darah sedikit naik" },
    { blood_sugar: 130, systolic: 115, diastolic: 75, created_at: "2024-03-12T08:00:00Z", ai_analysis: "Stabil terkendali" },
  ]
};

export const MOCK_CHART_DATA = [
  { day: "Sen", value: 120 },
  { day: "Sel", value: 145 },
  { day: "Rab", value: 130 },
  { day: "Kam", value: 170 },
  { day: "Jum", value: 140 },
  { day: "Sab", value: 120 },
  { day: "Min", value: 135 },
];

export const MOCK_CHAT_HISTORY = [
  { sender_id: "dr_reza", receiver_id: "pasien123", message: "Halo Darmawan, bagaimana kondisinya hari ini?", created_at: "10:00" },
  { sender_id: "pasien123", receiver_id: "dr_reza", message: "Halo Dokter, tadi pagi gula darah saya 130.", created_at: "10:05" },
  { sender_id: "dr_reza", receiver_id: "pasien123", message: "Bagus, tetap jaga pola makan ya.", created_at: "10:10" },
];