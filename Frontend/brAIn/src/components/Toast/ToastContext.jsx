import React, { createContext, useState } from 'react';

// Context 생성
export const ToastContext = createContext(null);

// Provider 정의
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (options) => {
    setToast(options);
    setTimeout(() => setToast(null), 3000); // 3초 후 자동 숨김
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};