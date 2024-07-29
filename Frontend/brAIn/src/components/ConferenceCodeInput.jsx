import React, { useRef } from "react";

const ConferenceCodeInput = ({ inputs, setInputs, keyPress }) => {
  // useRef의 초기값을 빈 배열로 설정합니다.
  const inputRefs = useRef([]);

  const handleChange = (index) => (e) => {
    const value = e.target.value;

    if (value === "" || /^[0-9]$/i.test(value)) {
      // inputs 배열을 복사하여 새로운 값을 설정합니다.
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      // 현재 입력값이 있는 경우, 다음 입력 필드로 포커스를 이동합니다.
      if (value && index < inputs.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index) => (e) => {
    // Backspace 키가 눌렸을 때, 현재 필드가 비어있고 이전 필드가 있는 경우 이전 필드로 포커스를 이동합니다.
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Enter 키가 눌렸을 때, keyPress 함수를 호출합니다.
    if (e.key === "Enter") {
      keyPress();
    }
  };

  return (
    <div className="w-full h-16 flex flex-row justify-between gap-2 mt-2">
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
          className="border-black flex-grow w-full rounded-xl text-center align-middle medium-32"
        />
      ))}
    </div>
  );
};

export default ConferenceCodeInput;
