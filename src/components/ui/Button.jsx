import React from 'react';

const variantClasses = {
    primary: 'bg-gold hover:bg-gold-dark text-white shadow-sm border border-transparent',
    outline: 'bg-white border border-gray-200 text-primary hover:bg-gray-50',
    'outline-dark': 'bg-transparent border border-brand-muted/50 text-white hover:bg-primary-light/20 hover:border-gold',
    ghost: 'bg-transparent text-primary hover:bg-gray-100',
};

const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-4 text-base font-bold rounded-xl',
    lg: 'px-8 py-5 text-lg font-bold rounded-xl',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon,
    isLoading,
    ...props
}) => {
    return (
        <button
            className={`
        flex items-center justify-center gap-3 transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : icon ? (
                <span className="flex items-center justify-center">{icon}</span>
            ) : null}

            {children}
        </button>
    );
};

export default Button;
