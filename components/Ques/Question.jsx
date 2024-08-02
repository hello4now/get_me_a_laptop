"use client";
import "./Question.css";
import { useState } from "react";

const Question = ({
  ques,
  options,
  currentStep,
  totalSteps,
  handleNext,
  handlePrev,
  handleOptionChange,
  selectedOption,
  handleSubmit,
  isSubmitting,
  errorMessage,
}) => {
  return (
    <>
      <div className="navleft">
        <button type="button" onClick={handlePrev}>
          <svg className="previcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#1c1b1e">
            <g data-name="Circle kiri">
              <path d="M12 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10zm0-18a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8z" />
              <path d="M13 16a1 1 0 0 1-.707-.293l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 1.414L11.414 12l2.293 2.293A1 1 0 0 1 13 16z" />
            </g>
          </svg>
          <span>Previous</span>
        </button>
      </div>

      <div className="que">
        <h3>{ques}</h3>
        <form className="options">
          {options.map((option, index) => (
            <div className="group" key={index}>
              <input
                type="radio"
                name={`sq-${currentStep}`}
                id={`radio-${index}`}
                value={option}
                className="input"
                checked={selectedOption === option}
                onChange={(e) =>
                  handleOptionChange(currentStep, e.target.value)
                }
              />
              <label htmlFor={`radio-${index}`} className="btn">
                <div className="span">{option}</div>
              </label>
            </div>
          ))}

          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
          <div className="submit">
            {currentStep === totalSteps - 1 && (
              <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              // className={isSubmitting? "submit_clicked" : "submit"}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="navright">
        <button
          type="button"
          onClick={handleNext}
          disabled={currentStep === totalSteps - 1}
          className={`navright-button ${currentStep === totalSteps - 1 ? 'disabled' : ''}`}
          >
          <svg className="nexticon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#e8eaed"> <g data-name="Circle kanan"> <path d="M12 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10zm0-18a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8z" /> <path d="M11 16a1 1 0 0 1-.707-1.707L12.586 12l-2.293-2.293a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414l-3 3A1 1 0 0 1 11 16z" /> </g> </svg>
          <span>Next</span>
        </button>
      </div>
    </>
  );
};

export default Question;
