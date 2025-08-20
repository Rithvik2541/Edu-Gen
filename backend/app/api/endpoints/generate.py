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

# @router.get("/ping")
# async def ping():
#     return {
#     "title": "Raycast Intermediate Quiz",
#     "questions": [
#         {
#             "question": "Which of the following is NOT a feature directly related to managing files and folders in Raycast?",
#             "options": [
#                 "Searching for files",
#                 "Creating quick links to frequently used files",
#                 "Converting images",
#                 "Appending entries to the clipboard"
#             ],
#             "correct_answer": "Converting images",
#             "explanation": "While Raycast can manage files, image conversion is a separate function, not directly related to file management."
#         },
#         {
#             "question": "Raycast allows users to interact with AI models in various ways. Which of these is NOT an AI-related capability?",
#             "options": [
#                 "Creating a playlist in Spotify",
#                 "Searching through AI chat history",
#                 "Setting up hotkeys for specific applications",
#                 "Getting help from AI models"
#             ],
#             "correct_answer": "Setting up hotkeys for specific applications",
#             "explanation": "Hotkeys can be set for various Raycast functions, but this feature isn't specific to AI interaction."
#         },
#         {
#             "question": "What system-level task can Raycast NOT perform?",
#             "options": [
#                 "Managing system settings",
#                 "Controlling music playback",
#                 "Managing email accounts",
#                 "Monitoring system resources"
#             ],
#             "correct_answer": "Managing email accounts",
#             "explanation": "Raycast focuses on system utilities, app launching, and productivity tools, not direct email account management."
#         },
#         {
#             "question": "Which feature allows users to streamline their workflow by creating reusable components?",
#             "options": [
#                 "Window management commands",
#                 "AI preset saving",
#                 "Reusable blocks of text",
#                 "Custom window layouts"
#             ],
#             "correct_answer": "Reusable blocks of text",
#             "explanation": "Reusable blocks of text save time by allowing pre-written text snippets to be inserted quickly."
#         },
#         {
#             "question": "Besides searching, what other method can be used to access quick links in Raycast?",
#             "options": [
#                 "Using emojis",
#                 "Using voice commands",
#                 "Using aliases or hotkeys",
#                 "Using custom icons"
#             ],
#             "correct_answer": "Using aliases or hotkeys",
#             "explanation": "Aliases and hotkeys provide alternative methods to quickly launch quick links, in addition to searching."
#         }
#     ]
# }
