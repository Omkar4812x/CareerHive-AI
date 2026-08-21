import re
import io
import logging
from typing import Dict, List, Any
import PyPDF2

logger = logging.getLogger("ResumeParser")

TECH_SKILLS_DB = [
    "Java", "Spring", "Spring Boot", "Hibernate", "JPA", "SQL", "MySQL", "PostgreSQL",
    "Oracle", "MongoDB", "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular",
    "Vue.js", "Node.js", "Express", "Python", "Django", "FastAPI", "Flask", "C++",
    "C#", ".NET", "Git", "GitHub", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "REST API", "Microservices", "Maven", "Gradle", "JUnit", "Kafka", "Redis",
    "Linux", "Tailwind CSS", "Bootstrap", "PHP", "Laravel", "Rust", "Go", "Golang",
    "GraphQL", "CI/CD", "Jenkins", "Pandas", "NumPy", "TensorFlow", "PyTorch"
]

ROLES_KEYWORDS = {
    "Java Developer": ["java", "spring", "spring boot", "hibernate"],
    "Backend Developer": ["backend", "sql", "rest api", "microservices", "node", "python", "fastapi"],
    "Software Developer": ["software engineer", "developer", "coding", "full stack", "software"],
    "SQL Developer": ["sql", "mysql", "postgresql", "database", "oracle", "queries"],
    "Junior Java Developer": ["fresher", "junior", "associate", "intern", "java"],
    "Web Developer": ["web", "html", "css", "javascript", "react", "frontend", "angular", "vue"],
    "Python Developer": ["python", "django", "flask", "fastapi", "pandas"]
}

class ResumeParser:
    """
    Parses candidate resume text or PDF file to generate a structured candidate profile.
    """
    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> str:
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
            text = ""
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
            return text
        except Exception as e:
            logger.error(f"Failed to extract text from PDF: {e}")
            return ""

    @staticmethod
    def parse_resume(raw_text: str) -> Dict[str, Any]:
        normalized_text = raw_text.lower()

        # 1. Extract Skills
        found_skills = []
        for skill in TECH_SKILLS_DB:
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, normalized_text):
                found_skills.append(skill)

        if not found_skills:
            found_skills = ["Java", "SQL", "MySQL", "HTML", "CSS", "JavaScript", "Git", "GitHub"]

        # 2. Extract Experience Level
        experience_level = "Fresher"
        if any(term in normalized_text for term in ["senior", "lead", "5+ years", "4+ years", "3+ years"]):
            experience_level = "1-3 years"
        elif any(term in normalized_text for term in ["fresher", "graduate", "trainee", "intern", "0-1 year"]):
            experience_level = "Fresher"

        # 3. Detect Preferred Roles
        preferred_roles = []
        for role, keywords in ROLES_KEYWORDS.items():
            matches = sum(1 for kw in keywords if kw in normalized_text)
            if matches >= 1:
                preferred_roles.append(role)

        if not preferred_roles:
            preferred_roles = ["Java Developer", "Junior Java Developer", "Backend Developer", "SQL Developer", "Software Developer"]

        # 4. Extract Name
        lines = [l.strip() for l in raw_text.splitlines() if l.strip()]
        full_name = None
        if lines:
            first_line = lines[0]
            if len(first_line.split()) <= 4 and not any(char in first_line for char in ['@', 'http', ':', '/', '\\']):
                full_name = first_line.title()

        # 5. Extract Email & Phone
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)

        # 6. Extract GitHub / Portfolio
        github_match = re.search(r'https?://(?:www\.)?github\.com/[\w\-]+', raw_text, re.IGNORECASE)
        portfolio_match = re.search(r'https?://[\w\.-]+\.(?:io|com|me|dev)', raw_text, re.IGNORECASE)

        return {
            "full_name": full_name,
            "skills": found_skills,
            "experience_level": experience_level,
            "preferred_roles": preferred_roles,
            "preferred_locations": ["Pune", "Hyderabad", "Bangalore"],
            "email": email_match.group(0) if email_match else None,
            "phone": phone_match.group(0) if phone_match else None,
            "github_url": github_match.group(0) if github_match else None,
            "portfolio_url": portfolio_match.group(0) if portfolio_match else None,
            "raw_text": raw_text[:2000]
        }

resume_parser = ResumeParser()
