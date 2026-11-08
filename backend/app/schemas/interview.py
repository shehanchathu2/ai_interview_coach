from pydantic import BaseModel, Field

class AnalysisResponse(BaseModel):
    candidate_analysis : str
    job_analysis : str
    matching_skills : list[str]
    missing_skills : list[str]
    interview_questions :list[str]
    
    

class EvaluationRequest(BaseModel):
    question :str
    answer : str
    job_posotion :str
    

class EvaluationResponse(BaseModel):
    score : int = Field(ge=0 , le=100)
    feedback :str
    strengths : list[str]
    improvements :list[str]