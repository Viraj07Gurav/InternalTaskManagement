import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md px-3 sm:px-6 py-[1rem] ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col  sm:flex-row items-center justify-between mb-4 gap-3 sm:gap-0 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h2 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </h2>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const Button = ({ variant, children, ...props }) => (
    <button
      className={`px-2 sm:px-6 py-2 rounded-md text-xs font-medium flex items-center cursor-pointer ${
        variant === "danger"
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
      {...props}
    >
      {children}
    </button>
  );