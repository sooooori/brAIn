import React from 'react';

const SmallButton = ({ onClick, className = '', children }) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-center px-2 py-1 min-w-[2.25rem] h-9 gap-2 rounded-xl text-sm font-semibold transition-transform duration-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SmallButton;
