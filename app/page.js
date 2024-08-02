"use client"
import { useState } from "react";
import Question from "@/components/Ques/Question";
import { saveOption2 } from "../actions/saveOption2.js";
import BudgetSlider from "@/components/BudgetSlider/BudgetSlider.js";
import ResultPage from "./result/ResultPage.js"; // Import ResultPage component
import "./page.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const questions = [
    { ques: "Primary Purpose: What will be the main use of the laptop?", options: ["Education/Regular work", "Business/office work", "Gaming", "Creative work"] },
    { ques: "Battery Life Expectation:", options: ["Good","High","Exceptional","No Preference"] },
    { ques: "Screen Size Preference: ", options: ["12 - 14 inches", "14 - 15 inches", "15 - 16 inches", "No preference"] },
    { ques: "Laptop Brand Preference: ", options: ["No Preference","Dell","Acer"] },
    { ques: "Weight Preference:", options:["Light","No Preference"]},
    { ques: "Secondary Purpose: What is the secondary use of the laptop?", options: ["Education/Regular work", "Business/office work", "Gaming", "Creative work"] }
  ];

  const totalSteps = questions.length;
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(Array(totalSteps).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [budget, setBudget] = useState([25000, 50000]);
  const [resultData, setResultData] = useState([]); // Initialize as an empty array
  const [view, setView] = useState("slider"); // Manage current view

  const handleNext = () => {
    if (selectedOptions[currentStep] === "") {
      setErrorMessage("*Please select an option before proceeding.");
      return;
    }
    setErrorMessage("");
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    if (currentStep === 0) {
      setView("slider");
    } else {
      setErrorMessage("");
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleOptionChange = (step, value) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[step] = value;
    setSelectedOptions(newSelectedOptions);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOptions.includes("")) {
      setErrorMessage("Please answer all questions before submitting.");
      return;
    }
    setIsSubmitting(true);

    const options = {
      minPrice: budget[0],
      maxPrice: budget[1],
      selectedOptions: selectedOptions,
    };

    try {
      console.log('Submitting options:', options);
      const result = await saveOption2(options);
      console.log('Options saved successfully:', result);
      setResultData(result); // Expecting an array of laptop recommendations with price_graph
      setView("result"); // Switch to result view
    } catch (error) {
      console.error('Error during submit:', error);
      setErrorMessage('Failed to save options');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSliderSubmit = (value) => {
    setBudget(value);
    setView("questions"); // Switch to questions view
  };

  return (
    <div className="mainbody">
      {view !== "result" && (
        <div className="yekaro">
          Tell us a bit about your needs by answering these questions, and our
          <span className="font-bold"> Machine Learning Model </span>
          will suggest the most suitable laptops for you.
        </div>
      )}
      {view === "slider" && <BudgetSlider value={budget} setValue={setBudget} onSubmit={handleSliderSubmit} />}
      {view === "questions" && (
        <div className="cardcontainer">
          <Question
            ques={questions[currentStep].ques}
            options={questions[currentStep].options}
            currentStep={currentStep}
            totalSteps={totalSteps}
            handleNext={handleNext}
            handlePrev={handlePrev}
            handleOptionChange={handleOptionChange}
            selectedOption={selectedOptions[currentStep]}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
          />
        </div>
      )}
      {view === "result" && Array.isArray(resultData) && resultData.length > 0 && (
        <div className="laptopnumber">
          {resultData.map((laptop, index) => (
            <ResultPage key={index} {...laptop} />
          ))}
        </div>
      )}
      {view === "result" && (!Array.isArray(resultData) || resultData.length === 0) && (
        <div className="no-results">
          No laptops found. Please try adjusting your preferences.
          <br />Our Database is in current phase of expansion. Thanks for your cooperation :)
        </div>
      )}
    </div>
  );
}
