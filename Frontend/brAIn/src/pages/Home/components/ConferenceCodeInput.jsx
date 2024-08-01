import React, { useRef } from "react";
import PropTypes from 'prop-types'; // Optional: to validate props

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
    <div className="flex justify-center mt-4">
      <div className="flex gap-2"> {/* Adjusted gap for better spacing */}
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
            className="w-12 h-12 border-2 border-gray-300 rounded-md text-center text-4xl font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-transform transform duration-300 ease-in-out hover:border-blue-600"
            style={{ width: '3rem', height: '3rem', lineHeight: '3rem' }} // Adjusted size and lineHeight for vertical centering
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
