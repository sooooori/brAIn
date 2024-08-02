import React, { useRef } from "react";
import PropTypes from 'prop-types'; // Optional: to validate props
import './ConferenceCodeInput.css'; // Import the CSS file

const ConferenceCodeInput = ({ inputs = [], setInputs, keyPress }) => {
  const inputRefs = useRef([]);

  const handleChange = (index) => (e) => {
    const value = e.target.value;

    if (value === "" || /^[0-9]$/i.test(value)) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      if (value && index < inputs.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      keyPress();
    }
  };

  return (
    <div className="code-input-container">
      <div className="code-inputs">
        {inputs.map((value, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            ref={(element) => (inputRefs.current[index] = element)}
            className="code-input"
          />
        ))}
      </div>
    </div>
  );
};

// Optional: PropTypes for validation
ConferenceCodeInput.propTypes = {
  inputs: PropTypes.array.isRequired,
  setInputs: PropTypes.func.isRequired,
  keyPress: PropTypes.func.isRequired,
};

export default ConferenceCodeInput;
