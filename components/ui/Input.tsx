'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 border-2 border-gray-200 rounded-lg
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            transition-all duration-300
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

