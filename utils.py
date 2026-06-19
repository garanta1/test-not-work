from docx import Document
import re
import requests
from bs4 import BeautifulSoup

# Простейший список технологий (можно расширить)
TECH_SKILLS = [
    "Python", "Java", "JavaScript", "C++", "C#", "SQL", "Docker", "Git",
    "Linux", "REST", "React", "Angular", "Vue", "Node.js", "TypeScript",
    "Django", "Flask", "FastAPI", "PostgreSQL", "MongoDB", "AWS", "Azure",
    "Kubernetes", "CI/CD", "Machine Learning", "Data Science", "TensorFlow"
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    import fitz  # PyMuPDF
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = "\n".join([page.get_text() for page in doc])
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    from io import BytesIO
    doc = Document(BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])

def extract_email(text: str) -> str:
    match = re.search(r'[\w\.-]+@[\w\.-]+', text)
    return match.group(0) if match else ""

def extract_phone(text: str) -> str:
    match = re.search(r'\+?\d[\d\-\(\) ]{6,}\d', text)
    return match.group(0) if match else ""

def extract_full_name(text: str) -> str:
    # Ищем первую правдоподобную строку ФИО на кириллице/латинице.
    pattern = re.compile(r"\b([A-ZА-ЯЁ][a-zа-яё]+(?:\s+[A-ZА-ЯЁ][a-zа-яё]+){1,2})\b")
    for line in text.splitlines()[:40]:
        clean = line.strip()
        if 5 <= len(clean) <= 80:
            m = pattern.search(clean)
            if m:
                return m.group(1)
    return "Имя не найдено"

def extract_skills(text: str) -> list:
    found = []
    lower_text = text.lower()
    for skill in TECH_SKILLS:
        if skill.lower() in lower_text:
            found.append(skill)
    return found

def build_analysis(skills: list[str], experience: str, education: str, email: str, phone: str) -> tuple[str, int]:
    score = 0
    score += min(len(skills) * 8, 50)
    if experience:
        score += 20
    if education:
        score += 10
    if email:
        score += 10
    if phone:
        score += 10
    score = min(score, 100)

    level = "низкая"
    if score >= 75:
        level = "высокая"
    elif score >= 50:
        level = "средняя"

    analysis = (
        f"Оценка профиля: {score}/100. "
        f"Полнота резюме {level}. "
        f"Найдено ключевых навыков: {len(skills)}."
    )
    return analysis, score

def parse_resume(text: str, source: str = "upload") -> dict:
    full_name = extract_full_name(text)

    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills(text)

    # Опыт и образование – упрощённо, ищем ключевые слова
    experience = ""
    edu = ""
    lines = text.split('\n')
    for line in lines:
        if any(w in line.lower() for w in ["опыт работы", "стаж", "работал"]):
            experience += line.strip() + "; "
        if any(w in line.lower() for w in ["образование", "университет", "вуз"]):
            edu += line.strip() + "; "
    analysis, score = build_analysis(skills, experience, edu, email, phone)

    return {
        "full_name": full_name,
        "email": email,
        "phone": phone,
        "skills": ", ".join(skills),
        "experience": experience.strip("; "),
        "education": edu.strip("; "),
        "analysis": analysis,
        "score": score,
        "source": source,
        "raw_text": text[:2000]   # ограничим хранение
    }

def parse_hh_url(url: str) -> dict:
    """Парсинг резюме с hh.ru (упрощённо)."""
    headers = {"User-Agent": "Mozilla/5.0"}
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        raise ValueError("Не удалось загрузить страницу")
    soup = BeautifulSoup(resp.text, 'html.parser')
    # Извлечение текста (сильно упрощено)
    text = soup.get_text(separator='\n')
    return parse_resume(text, source="hh.ru")