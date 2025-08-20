from fastapi import FastAPI
from app.api.router import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="YouTube Learning Content Generator",
    description="An AI-powered service to create educational materials from YouTube videos.",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# This is crucial to allow your React frontend to communicate with this backend.
origins = [
    "http://localhost:3000",  # The default port for React development servers
    # Add your deployed frontend URL here later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the YouTube Learning Content Generator API!"}

# Include the main API router
app.include_router(api_router, prefix="/api")