import React, { useState, useEffect } from 'react';
import './quiz.css';

const DynamicQuiz = ({ videoUrl, onClose }) => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (videoUrl) {
      generateQuiz();
    }
  }, [videoUrl]);

  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/generatequiz', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_url: videoUrl,
          content_type: 'quiz',
          difficulty: 'Intermediate'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Quiz data received:', data);
      
      // Transform the data to match the expected format
      const transformedQuizData = data.questions.map((question, index) => ({
        questionId: index + 1,
        questionText: question.question,
        options: question.options,
        correctAnswer: question.correct_answer,
        explanation: question.explanation
      }));

      // Validate the transformed data
      const validQuestions = transformedQuizData.filter(q => 
        q.questionText && 
        q.options && 
        Object.keys(q.options).length > 0 &&
        q.correctAnswer
      );
      
      if (validQuestions.length === 0) {
        throw new Error('No valid questions found in the response');
      }
      
      setQuizData({
        title: data.title || 'Quiz',
        questions: validQuestions
      });
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-container">
          <div className="quiz-header">
            <h2>Generating Quiz...</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="loading-spinner">⏳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-container">
          <div className="quiz-header">
            <h2>Error Generating Quiz</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={generateQuiz}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.questions.length) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-container">
          <div className="quiz-header">
            <h2>No Quiz Data</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    if (!showExplanation) {
      setSelectedOption(option);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleDontKnow = () => {
    setShowExplanation(true);
  };

  const getOptionClass = (option) => {
    if (!showExplanation) return 'option';
    
    if (option === currentQuestion.correctAnswer) {
      return 'option correct';
    }
    
    if (selectedOption === option && option !== currentQuestion.correctAnswer) {
      return 'option incorrect';
    }
    
    return 'option';
  };

  const isCorrect = selectedOption === currentQuestion.correctAnswer;
  
  return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>{quizData.title}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      
      <div className="question-container">
        <h3 className="question-text">
          {currentQuestion.questionId}. {currentQuestion.questionText}
        </h3>
        
        <div className="options-container">
          {currentQuestion.options && typeof currentQuestion.options === 'object' ? (
            Object.entries(currentQuestion.options).map(([key, value]) => (
              <div
                key={key}
                className={getOptionClass(key)}
                onClick={() => handleOptionSelect(value)}
              >
                <span className="option-label">{key}.</span>
                <span className="option-text">{value}</span>
              </div>
            ))
          ) : (
            <div className="error-message">No options available</div>
          )}
        </div>
        
        {showExplanation && (
          <div className={`explanation ${isCorrect ? 'correct-explanation' : 'incorrect-explanation'}`}>
            <div className="explanation-header">
              <span className="explanation-icon">
                {isCorrect ? '✓' : '✗'}
              </span>
              <span className="explanation-text">
                {isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            <p className="explanation-content">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>
      
      <div className="controls">
        <div className="left-controls">
          <button 
            className="control-btn refresh-btn"
            onClick={() => {
              setSelectedOption(null);
              setShowExplanation(false);
            }}
          >
            ↻
          </button>
          <button 
            className="control-btn check-btn"
            onClick={handleDontKnow}
            disabled={showExplanation}
          >
            ✓
          </button>
        </div>
        
        <div className="question-counter">
          {currentQuestionIndex + 1} / {quizData.questions.length}
        </div>
        
        <div className="right-controls">
          <button 
            className="control-btn dont-know-btn"
            onClick={handleDontKnow}
            disabled={showExplanation}
          >
            Don't know
          </button>
          <button 
            className="control-btn next-btn"
            onClick={handleNext}
            disabled={currentQuestionIndex === quizData.questions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
      
      {currentQuestionIndex > 0 && (
        <button 
          className="previous-btn"
          onClick={handlePrevious}
        >
          Previous
        </button>
      )}
      </div>
    </div>
  );
};

export default DynamicQuiz;
