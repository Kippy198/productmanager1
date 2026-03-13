"use client"

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variable?: "primary"|"danger"|"success"|"secondary"|"info"|"warning"|"cancel";
    size?: "sm"|"md"|"lg";
    isLoading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
    children: React.ReactNode;
    className?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>( ( 
    {   variable = "primary", 
        size = "md", 
        isLoading = false, 
        loadingText = "Loading...", 
        fullWidth = false, 
        disabled = false, 
        children, 
        className = "", 
        ...props }
        , ref ) => {
            const baseStyle = "font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 ";
            const variantStyle = {
                primary:"flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed", 
                danger: "flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition", 
                success: "flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed", 
                secondary: "flex-1 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200", 
                info: "flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white focus:ring-blue-500", 
                warning: "flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200", 
                cancel: "px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
            };

            const sizeStyle = {
                sm:"px-3 py-1.5 text-xs",
                md:"px-6 py-2 text-sm",
                lg:"px-6 py-3 text-base"
            };
            const widthStyle = fullWidth?"w-full":"";

            return (
                <button ref={ref} disabled={disabled || isLoading} className= {` ${baseStyle} ${variantStyle[variable]} ${sizeStyle[size]} ${widthStyle} ${className} `} {...props}>
                    {isLoading ? (
                        <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" > <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" ></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" ></path> </svg>
                        </>
                    ) : (
                        children
                    )}
                </button>
            );
        } 
    );

    Button.displayName = "Button";
export default Button;
