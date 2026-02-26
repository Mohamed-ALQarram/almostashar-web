import React, { forwardRef, useState } from 'react';

const Input = forwardRef(({
    label,
    labelRight,
    type = 'text',
    error,
    icon,
    rightElement,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="w-full flex flex-col gap-2">
            {(label || labelRight) && (
                <div className="flex justify-between items-center text-sm mb-1 px-1">
                    {label && <label className="text-primary font-semibold">{label}</label>}
                    {labelRight && <div>{labelRight}</div>}
                </div>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute top-1/2 -translate-y-1/2 start-3.5 text-brand-muted flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={inputType}
                    className={`
            w-full border rounded-xl px-4 py-3.5 bg-white text-sm outline-none transition-all duration-200
            ${icon ? 'ps-11' : ''}
            ${(isPassword || rightElement) ? 'pe-11' : ''}
            ${error
                            ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
                            : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary'}
            placeholder-brand-muted text-primary font-medium
          `}
                    {...props}
                />
                {isPassword && !rightElement && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 -translate-y-1/2 end-3.5 text-brand-muted hover:text-primary transition-colors flex items-center justify-center p-1"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        )}
                    </button>
                )}
                {rightElement && (
                    <div className="absolute top-1/2 -translate-y-1/2 end-3 text-brand-muted flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && <span className="text-xs text-error mt-0.5 px-1">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
