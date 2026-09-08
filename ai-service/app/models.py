from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# ─── Copilot Models ──────────────────────────────────────────

class CopilotMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: str

class StudentContext(BaseModel):
    name: Optional[str] = None
    target_role: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    education_level: Optional[str] = "Undergraduate"
    preferred_location: Optional[str] = None

class CopilotRequest(BaseModel):
    messages: List[CopilotMessage]
    student_context: Optional[StudentContext] = None
    stream: bool = False

class CopilotResponse(BaseModel):
    response: str
    suggested_actions: List[str] = Field(default_factory=list)
    recommended_skills: List[str] = Field(default_factory=list)
    disclaimer: str = "CareerSetu AI provides guidance and recommendations. All career choices and assessment submissions should be verified independently."

# ─── Skill Gap Models ────────────────────────────────────────

class SkillGapRequest(BaseModel):
    student_skills: List[str]
    target_role: str
    required_skills: Optional[List[str]] = None

class SkillRecommendation(BaseModel):
    skill: str
    importance: str  # CRITICAL, HIGH, MEDIUM
    learning_resources: List[str]
    estimated_hours: int

class SkillGapResponse(BaseModel):
    target_role: str
    match_percentage: int
    matching_skills: List[str]
    missing_skills: List[str]
    recommendations: List[SkillRecommendation]
    action_plan_summary: str

# ─── Resume Analyzer Models ──────────────────────────────────

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Software Engineer Intern"
    target_industry: Optional[str] = "Technology"

class ResumeAnalyzeResponse(BaseModel):
    overall_score: int
    ats_compatibility_score: int
    strengths: List[str]
    weaknesses: List[str]
    missing_keywords: List[str]
    actionable_improvements: List[str]
    summary: str

class ResumeUploadResponse(BaseModel):
    extracted_text: str
    file_name: str
    char_count: int
    analysis: ResumeAnalyzeResponse

# ─── Opportunity Matching Models ─────────────────────────────

class MatchRequest(BaseModel):
    candidate_skills: List[str]
    candidate_experience_months: int = 0
    candidate_cgpa: Optional[float] = None
    opportunity_title: str
    opportunity_required_skills: List[str]
    opportunity_min_cgpa: Optional[float] = None
    opportunity_location: Optional[str] = None
    candidate_location: Optional[str] = None

class MatchResponse(BaseModel):
    match_score: int
    skill_alignment_score: int
    eligibility_met: bool
    reasons_for_match: List[str]
    gaps: List[str]
    hiring_recommendation: str
