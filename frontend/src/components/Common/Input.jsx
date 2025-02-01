import React from 'react';

const Input = ({ label, error, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
      )}
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;