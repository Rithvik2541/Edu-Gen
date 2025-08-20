from pydantic import BaseModel
from typing import List, Literal

# --- Request Models ---
class GenerateRequest(BaseModel):
    video_url: str
    content_type: Literal['summary', 'notes', 'quiz', 'flashcards']
    difficulty: Literal['Beginner', 'Intermediate', 'Advanced'] = 'Intermediate'

# --- Response Models for Generated Content ---

# For Summary
class SummaryResponse(BaseModel):
    short_summary: str
    detailed_summary: str
    bullet_points: List[str]

# For Notes
class NoteItem(BaseModel):
    heading: str
    points: List[str]
    
class NotesResponse(BaseModel):
    title: str
    notes: List[NoteItem]

# For Quiz
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizResponse(BaseModel):
    title: str
    questions: List[QuizQuestion]

# For Flashcards
class Flashcard(BaseModel):
    front: str
    back: str

class FlashcardsResponse(BaseModel):
    title: str
    flashcards: List[Flashcard]