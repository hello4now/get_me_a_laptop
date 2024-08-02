import React from "react";
import { Slider } from "@nextui-org/react";
import "./BudgetSLider.css";
import { Container } from "postcss";

const BudgetSlider = ({ value, setValue, onSubmit }) => {
  const handleSubmit = () => {
    onSubmit(value);
  };

  return (
    <div className="slidercontainer">
      <div className="slider">
        <div className="sliderdetails">
          <h3>How much do you want to spend?</h3> <br />
        </div>
          <div className="details">
            <Slider
              // label="Select a budget"
              // formatOptions={{style: "currency", currency: "USD"}}
              step={1000}
              maxValue={100000}
              minValue={25000}
              value={value}
              onChange={setValue}
              className="aslislider"
            />
            <p className="text-default-500 font-medium text-small">
              Selected budget: {Array.isArray(value) && value.map((b) => `₹${b}`).join(" – ")}
            </p>
          </div>
        <button onClick={handleSubmit} className="buttton btn-primary ">
          Proceed
        </button>

      </div>
    </div>
  );
};

export default BudgetSlider;
