from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema import StrOutputParser
from youtube_transcript_api import YouTubeTranscriptApi

from app.core.config import settings

def get_youtube_transcript(video_url: str) -> str:
    """Fetches the transcript for a given YouTube video URL."""
    try:
        video_id = video_url.split("v=")[1].split("&")[0]
        yt_api = YouTubeTranscriptApi()
        transcript_data = yt_api.fetch(video_id)
        transcript = " ".join([d.text for d in transcript_data])
        return transcript
    except Exception as e:
        raise ValueError(f"Failed to fetch transcript: {e}")

def create_generation_chain(llm, content_type: str, difficulty: str):
    """Creates a LangChain chain for generating educational content."""
    
    templates = {
        'summary': """
            You are an expert in summarizing educational content. Based on the following transcript, provide:
            1. A concise 2-paragraph overview (short_summary).
            2. A comprehensive, detailed summary with key concepts and conclusions (detailed_summary).
            3. A list of 5-7 key takeaways in bullet points (bullet_points).
            
            Respond ONLY with a valid JSON object with the keys "short_summary", "detailed_summary", and "bullet_points".
            
            Transcript: {transcript}
        """,
        'notes': """
            You are an expert note-taking assistant. Structure the key information from the following transcript into organized notes.
            Create a main title and then a list of logical sections, each with a heading and a list of key points.
            
            Respond ONLY with a valid JSON object with keys "title" and "notes". "notes" should be a list of objects, each with "heading" and "points".
            
            Transcript: {transcript}
        """,
        'quiz': """
            You are an expert quiz creator. Based on the following transcript, create a {difficulty} level quiz with 5 multiple-choice questions.
            For each question, provide:
            - "questionText": the question as a string,
            - "options": an object with keys "A", "B", "C", and "D" and their corresponding answer choices as string values,
            - "correctAnswer": the letter ("A", "B", "C", or "D") of the correct option,
            - "explanation": a brief explanation for the correct answer.

            Respond ONLY with a valid JSON object with keys "title" and "questions". "questions" should be a list of objects, each in the following format:

            {
              "questionText": "",
              "options": {
                "A": "",
                "B": "",
                "C": "",
                "D": ""
              },
              "correctAnswer": "",
              "explanation": ""
            }

            Transcript: {transcript}
        """,
        'flashcards': """
            You are an expert at creating study materials. From the following transcript, generate 10 flashcards for spaced repetition.
            Each flashcard should have a 'front' (a key term or question) and a 'back' (the definition or answer).
            
            Respond ONLY with a valid JSON object with keys "title" and "flashcards". "flashcards" should be a list of objects, each with "front" and "back".
            
            Transcript: {transcript}
        """
    }

    if content_type not in templates:
        raise ValueError("Invalid content type specified.")

    prompt = PromptTemplate(
        template=templates[content_type],
        input_variables=["transcript", "difficulty"]
    )

    # The chain combines fetching the transcript, formatting the prompt, calling the LLM, and parsing the output.
    chain = (
        {"transcript": RunnablePassthrough(), "difficulty": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return chain

def generate_content_from_transcript(transcript: str, content_type: str, difficulty: str):
    """Generates the final content using the LLM."""
    if not settings.GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in environment variables.")
        
    # Set the API key as environment variable for LangChain
    import os
    os.environ["GOOGLE_API_KEY"] = settings.GOOGLE_API_KEY
    
    # Try different models in case of quota issues
    models_to_try = ["gemini-1.5-flash"]
    
    for model_name in models_to_try:
        try:
            llm = ChatGoogleGenerativeAI(model=model_name)
            # Test the model with a simple prompt
            test_response = llm.invoke("Hello")
            print(f"Successfully using model: {model_name}")
            break
        except Exception as e:
            print(f"Failed with model {model_name}: {str(e)}")
            if model_name == models_to_try[-1]:  # Last model
                raise ValueError(f"All models failed. Last error: {str(e)}")
            continue
    
    # Get the appropriate template
    templates = {
        'summary': """
            You are an expert in summarizing educational content. Based on the following transcript, provide:
            1. A concise 2-paragraph overview (short_summary).
            2. A comprehensive, detailed summary with key concepts and conclusions (detailed_summary).
            3. A list of 5-7 key takeaways in bullet points (bullet_points).
            
            Respond ONLY with a valid JSON object with the keys "short_summary", "detailed_summary", and "bullet_points".
            
            Transcript: {transcript}
        """,
        'notes': """
            You are an expert note-taking assistant. Structure the key information from the following transcript into organized notes.
            Create a main title and then a list of logical sections, each with a heading and a list of key points.
            
            Respond ONLY with a valid JSON object with keys "title" and "notes". "notes" should be a list of objects, each with "heading" and "points".
            
            Transcript: {transcript}
        """,
        'quiz': """
            You are an expert quiz creator. Based on the following transcript, create a {difficulty} level quiz with 5 multiple-choice questions.
            For each question, provide the question, a list of 4 options, the correct answer, and a brief explanation.
            
            Respond ONLY with a valid JSON object with keys "title" and "questions". "questions" should be a list of objects, each containing "question", "options", "correct_answer", and "explanation".
            
            Transcript: {transcript}
        """,
        'flashcards': """
            You are an expert at creating study materials. From the following transcript, generate 10 flashcards for spaced repetition.
            Each flashcard should have a 'front' (a key term or question) and a 'back' (the definition or answer).
            
            Respond ONLY with a valid JSON object with keys "title" and "flashcards". "flashcards" should be a list of objects, each with "front" and "back".
            
            Transcript: {transcript}
        """
    }
    
    if content_type not in templates:
        raise ValueError("Invalid content type specified.")
    
    # Create the prompt template
    prompt = PromptTemplate(
        template=templates[content_type],
        input_variables=["transcript", "difficulty"]
    )
    
    # Create and run the chain
    chain = prompt | llm | StrOutputParser()
    response = chain.invoke({"transcript": transcript, "difficulty": difficulty})
    return response