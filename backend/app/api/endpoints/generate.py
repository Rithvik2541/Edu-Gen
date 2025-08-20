from fastapi import APIRouter, HTTPException
from app.schemas.content import GenerateRequest
from app.core.llm import get_youtube_transcript, generate_content_from_transcript
import json

router = APIRouter()

@router.post("/")
async def generate_educational_content(request: GenerateRequest):
    """
    Receives a YouTube URL and content preferences, then generates
    educational material using an LLM.
    """
    try:
        print(f"Processing request for video: {request.video_url}")
        print(f"Content type: {request.content_type}")
        print(f"Difficulty: {request.difficulty}")
        
        # 1. Fetch transcript from YouTube
        print("Step 1: Fetching transcript...")
        transcript = get_youtube_transcript(request.video_url)
        if not transcript:
            raise HTTPException(status_code=404, detail="Transcript not found or video is invalid.")
        print(f"Step 1: Transcript fetched successfully")
            
        # 2. Generate content using the LLM
        print("Step 2: Generating content with LLM...")
        generated_json_str = generate_content_from_transcript(
            transcript=transcript,
            content_type=request.content_type,
            difficulty=request.difficulty
        )
        
        # 3. Parse the JSON response from the LLM
        # The LLM output might have markdown ```json ``` markers, let's clean them.
        if generated_json_str.strip().startswith("```json"):
            generated_json_str = generated_json_str.strip()[7:-4]

        content_response = json.loads(generated_json_str)
        
        return content_response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # For any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {str(e)}")