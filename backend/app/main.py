
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.interview import router

app = FastAPI(
    title="AI Interview Coach API",
    description="AI-powered personalized interview preparation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["Interview"])


@app.get("/")
def home():
    return {"message": "AI Interview Coach API is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}



