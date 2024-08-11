import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'; // 추가된 CSS 파일 import

// Define button styles
const BUTTON_STYLES = {
  black: "bg-grayscale-black text-grayscale-white",
  gray: "bg-grayscale-lightgray text-grayscale-black",
  red: "bg-alert-100 text-grayscale-white",
  blue: "bg-boarlog-100 text-grayscale-white",
  green: "bg-success-100 text-grayscale-white",
  orange: "bg-warning-100 text-grayscale-black"
};

Object.freeze(BUTTON_STYLES);

// Button component
const Button = ({ type, onClick, className, children, value, buttonStyle, ariaLabel, disabled }) => {
  return (
    <button
      type="button"
      className={`flex flex-row justify-center items-center gap-1 py-3 rounded-xl semibold-18 hover:opacity-70 duration-500 ${
        type === "full" ? "w-full" : type === "fit" ? "px-3 w-fit" : type === "grow" ? "flex-grow basis-0" : ""
      } ${BUTTON_STYLES[buttonStyle]} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      value={value}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Define PropTypes for type checking
Button.propTypes = {
  type: PropTypes.oneOf(["full", "fit", "grow"]).isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
  buttonStyle: PropTypes.oneOf(["black", "gray", "red", "blue", "green", "orange"]).isRequired,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool // Added prop type for disabled
};

export default Button;
