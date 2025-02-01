import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-row items-center justify-between mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h2 className={`text-2xl font-bold text-gray-800 ${className}`}>
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