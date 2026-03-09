import React from 'react';

const Button = ({ children, onClick, disabled, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-6 py-2.5 rounded-xl font-bold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
        primary: "btn-primary shadow-lg shadow-primary/20",
        secondary: "bg-white/50 backdrop-blur-md border border-white/40 text-gray-700 hover:bg-white/80 dark:bg-slate-800/50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-slate-800/80",
        outline: "border-2 border-primary/30 text-primary hover:bg-primary/5 dark:border-primary/50 dark:text-primary dark:hover:bg-primary/10"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
