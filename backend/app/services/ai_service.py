import os 

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")


if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set.")

client = OpenAI(api_key = api_key)

def analyze_candidate(cv_text:str , job_description:str) -> str:
    prompt = f"""
    You are an experienced technical recruiter.

    Analyze the following candidate CV against the job description.

    CANDIDATE CV:
    {cv_text}

    JOB DESCRIPTION:
    {job_description}

    Provide your response using these sections:

    1. Candidate Summary
    2. Candidate Technical Skills
    3. Relevant Experience
    4. Matching Skills
    5. Missing or Unclear Skills
    6. Overall Suitability
    7. Five Personalized Interview Questions

    Be accurate. Do not invent experience or skills.
    If information is missing, clearly say so.
    """
    
    response = client.responses.create(
        model = model , 
        instructions = "You are a helpful and professional technical recruiter.",
        input = prompt,
    )
    
    return response.output_text

def generate_interview_questions(
    cv_text:str,
    job_description:str
) ->str:
    
    prompt = f"""
    Generate 5 personalized technical interview questions.

    Candidate CV:
    {cv_text}

    Job Description:
    {job_description}

    Requirements:
    - Questions must match the candidate's experience.
    - Include technical and practical questions.
    - Include one problem-solving question.
    - Avoid generic questions.
    - Number the questions clearly.
    """

    response = client.responses.create(
        model=model,
        instructions="You are a senior software engineering interviewer.",
        input=prompt
    )

    return response.output_text 

def evaluate_answer(
    question: str,
    answer: str,
    job_position: str
) -> str:

    prompt = f"""
    Evaluate this candidate's interview answer.

    Job Position: {job_position}

    Interview Question:
    {question}

    Candidate Answer:
    {answer}

    Evaluate using:
    1. Technical correctness
    2. Understanding of the concept
    3. Clarity of explanation
    4. Practical examples

    Give:
    - Score from 0 to 100
    - Feedback
    - Strengths
    - Areas to improve
    - An example of a better answer

    Be fair and constructive.
    Do not give a high score just because the answer is long.
    """

    response = client.responses.create(
        model=model,
        instructions="You are an experienced software engineering interviewer.",
        input=prompt
    )

    return response.output_text









