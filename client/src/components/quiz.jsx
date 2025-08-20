import React, { useState } from 'react';
import './quiz.css';

const QuizApp = () => {
  const quizData = [
    {
      questionId: 1,
      questionText: "Which data structure is used in a recursive function call?",
      options: {
        A: "Queue",
        B: "Stack",
        C: "Array",
        D: "Linked List"
      },
      correctAnswer: "B",
      explanation: "Recursive calls use the call stack to keep track of function calls."
    },
    {
      questionId: 2,
      questionText: "Which of the following is NOT an OOP principle?",
      options: {
        A: "Encapsulation",
        B: "Polymorphism",
        C: "Abstraction",
        D: "Compilation"
      },
      correctAnswer: "D",
      explanation: "Compilation is a process, not an OOP principle."
    },
    {
      questionId: 3,
      questionText: "What does SQL stand for?",
      options: {
        A: "Structured Query Language",
        B: "Simple Query Language",
        C: "Sequential Query Language",
        D: "Stylish Query Language"
      },
      correctAnswer: "A",
      explanation: "SQL is Structured Query Language, used for database interaction."
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    if (!showExplanation) {
      setSelectedOption(option);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
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
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Quiz generated!</h2>
      </div>
      
      <div className="question-container">
        <h3 className="question-text">
          {currentQuestion.questionId}. {currentQuestion.questionText}
        </h3>
        
        <div className="options-container">
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <div
              key={key}
              className={getOptionClass(key)}
              onClick={() => handleOptionSelect(key)}
            >
              <span className="option-label">{key}.</span>
              <span className="option-text">{value}</span>
            </div>
          ))}
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
          {currentQuestionIndex + 1} / {quizData.length}
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
            disabled={currentQuestionIndex === quizData.length - 1}
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
  );
};

export default QuizApp;