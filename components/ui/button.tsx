import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out ${className}`}
        >
            {children}
        </button>
    );
};
