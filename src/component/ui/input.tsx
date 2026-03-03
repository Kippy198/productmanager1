import React from "react";
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    helperText?: React.ReactNode;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>
 (
    (
        {   label,
            error,
            required = false,
            className = "",
            disabled = false,
            helperText,
            ...props
        }, ref) => 
        {
            const baseInputStyles = "w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200 font-medium bg-white dark:bg-slate-700 text-black dark:text-white";

            const normalStyle = "border-gray-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400";

            const errorStyle = error
                                ? "border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-400"
                                : ""
            const disableStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

            return (
                <div className="w-full">
                    {label && (
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )}
                    <input ref={ref} disabled ={disabled} className= {` ${baseInputStyles} ${error ? errorStyle: normalStyle} ${disableStyles} ${className}`} {...props}/>
                    {error ? (
                        <p className="text-red-600 text-sm mt-1 font-medium">{error}</p>
                            ) : (
                            helperText && (
                                <p className="text-xs text-gray-500 mt-1">{helperText}</p>
                            )
                        )}
                </div>
            );
        }
    );
    FormInput.displayName = "FormInput";
    export default FormInput;