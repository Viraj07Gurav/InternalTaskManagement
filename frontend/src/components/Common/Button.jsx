import React from 'react';

const Button = ({ children, variant = 'default', className = '', icon, iconPosition = 'left', ...props }) => {
  const variants = {
    default: 'px-4 py-2 text-sm cursor-pointer',
    primary: 'px-4 py-3 text-base bg-blue-500 text-white font-semibold hover:bg-blue-600 rounded-xl cursor-pointer',
    secondary: 'px-4 py-3 text-sm text-gray-900 font-semibold border border-gray-300 hover:bg-gray-50 rounded-xl cursor-pointer',
  };

  return (
    <button
      className={`${variants[variant]} ${className} flex items-center gap-[2rem] sm:gap-[3rem] ${!icon ? 'justify-center w-full' : ''}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2 text-lg">
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
