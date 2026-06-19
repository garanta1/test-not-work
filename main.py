from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from model import Resume
from schemas import ResumeResponse
from utils import (
    extract_text_from_pdf,
    extract_text_from_docx,
    parse_resume,
    parse_hh_url
)
from pathlib import Path

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload", response_model=ResumeResponse)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()

    filename = (file.filename or "").lower()
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        text = extract_text_from_docx(content)
    else:
        raise HTTPException(
            400,
            f"Поддерживаются только PDF и DOCX. Получено: filename='{file.filename}', content_type='{file.content_type}'",
        )
    data = parse_resume(text)
    db_resume = Resume(**data)
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

@app.post("/parse-url", response_model=ResumeResponse)
async def parse_url(url: str = Form(...), db: Session = Depends(get_db)):
    try:
        data = parse_hh_url(url)
        db_resume = Resume(**data)
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        return db_resume
    except Exception as e:
        raise HTTPException(400, detail=str(e))

@app.get("/resumes", response_model=list[ResumeResponse])
def get_resumes(
    skip: int = 0,
    limit: int = Query(default=100, le=500),
    q: str = "",
    db: Session = Depends(get_db),
):
    query = db.query(Resume)
    if q:
        like = f"%{q}%"
        query = query.filter(
            (Resume.full_name.ilike(like))
            | (Resume.skills.ilike(like))
            | (Resume.experience.ilike(like))
            | (Resume.education.ilike(like))
        )
    resumes = query.order_by(Resume.id.desc()).offset(skip).limit(limit).all()
    return resumes


# --- Раздача собранного frontend (production) ---
_DIST_DIR = (Path(__file__).resolve().parents[1] / "frontend" / "dist").resolve()

if _DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(_DIST_DIR / "assets")), name="assets")

    @app.get("/", include_in_schema=False)
    def serve_index():
        return FileResponse(str(_DIST_DIR / "index.html"))

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_spa(full_path: str):
        candidate = (_DIST_DIR / full_path).resolve()
        if str(candidate).startswith(str(_DIST_DIR)) and candidate.exists() and candidate.is_file():
            return FileResponse(str(candidate))
        return FileResponse(str(_DIST_DIR / "index.html"))