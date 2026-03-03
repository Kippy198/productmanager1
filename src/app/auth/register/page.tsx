"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/src/lib/auth";
import { useToast } from "@/src/lib/useToast";
import Button from "@/src/component/ui/button";
import FormInput from "@/src/component/ui/input";

export default function RegisterPage() {
    const router = useRouter();
    const { success, error: errorToast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const validateForm = () => {
        const errors: { name?: string; email?: string; password?: string } = {};
        
        if (!name.trim()) {
            errors.name = "Name is required";
        } else if (name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
        }
        
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Please enter a valid email";
        }
        
        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        } else if (!/[A-Z]/.test(password)) {
            errors.password = "Password must contain at least one uppercase letter";
        } else if (!/[0-9]/.test(password)) {
            errors.password = "Password must contain at least one number";
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await register({ name, email, password });
            success("Registration successful! Redirecting to login...");
            setTimeout(() => {
                router.push("/auth/login");
                router.refresh();
            }, 1000);
        } catch (err: any) {
            errorToast(err.message || "Registration failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };

    const clearFieldError = (field: keyof typeof fieldErrors) => {
        if (fieldErrors[field]) {
            setFieldErrors({ ...fieldErrors, [field]: undefined });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">

                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Đăng Ký</h1>
                        <p className="text-blue-100">Tạo tài khoản mới của bạn</p>
                    </div>

                    <form onSubmit={handleRegister} className="px-8 py-8 space-y-6">

                        <FormInput 
                            label="Tên Của Bạn"
                            id="name"
                            type="text"
                            value={name}
                            className="text-white"
                            placeholder="Nhập tên của bạn"
                            onChange={(e) => {
                                setName(e.target.value);
                                clearFieldError("name");
                            }}
                            error={fieldErrors.name}
                        />
            
                        <FormInput 
                            label="Tài Khoản Email"
                            id="email"
                            type="email"
                            value={email}
                            className="text-white"
                            placeholder="Nhập tài khoản của bạn"
                            error={fieldErrors.email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearFieldError("email");
                            }}
                            helperText = "Enter a valid email"
                        />
             
                        <FormInput
                            label="Mật Khẩu"
                            id="password"
                            type="password"
                            className="text-white"
                            placeholder="Nhập mật khẩu của bạn"
                            value={password}
                            error={fieldErrors.password}
                            helperText="• At least 6 characters • 1 uppercase letter • 1 number"
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearFieldError("password");
                            }}
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            variable="primary"
                            fullWidth
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang đăng ký...
                                </span>
                            ) : (
                                "Đăng Ký"
                            )}
                        </Button>
                    </form>

                    <div className="bg-gray-50 dark:bg-slate-700 px-8 py-4 text-center border-t border-gray-200 dark:border-slate-600">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Đã có tài khoản?{" "}
                            <a href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                                Đăng nhập ngay
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
