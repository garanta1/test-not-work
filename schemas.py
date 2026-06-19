from pydantic import BaseModel

class ResumeBase(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    skills: str = ""
    experience: str = ""
    education: str = ""
    analysis: str = ""
    score: int = 0
    source: str = "upload"

class ResumeCreate(ResumeBase):
    raw_text: str = ""

class ResumeResponse(ResumeBase):
    id: int
    class Config:
        from_attributes = True