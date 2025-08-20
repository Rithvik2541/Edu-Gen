from fastapi import APIRouter
from app.api.endpoints import generate

api_router = APIRouter()

# Include the router from the 'generate' endpoint
api_router.include_router(generate.router, prefix="/generate", tags=["Content Generation"])