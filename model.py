from sqlalchemy import Column, Integer, String, Text
from database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, default="Не указано")
    email = Column(String, default="")
    phone = Column(String, default="")
    skills = Column(Text, default="")          # comma separated
    experience = Column(Text, default="")      # краткий опыт
    education = Column(Text, default="")
    analysis = Column(Text, default="")
    score = Column(Integer, default=0)
    source = Column(String, default="upload")  # откуда получено
    raw_text = Column(Text, default="")