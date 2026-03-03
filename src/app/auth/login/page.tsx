"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/src/lib/auth";
import { useToast } from "@/src/lib/useToast";
import Button from "@/src/component/ui/button";
import FormInput from "@/src/component/ui/input";

export default function LoginPage() {
    const router = useRouter()
    const { success, error: errorToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};
        
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Please enter a valid email";
        }
        
        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await login({ email, password });
            success("Login successful!");
            router.push("/dashboard/dashboard");
            router.refresh();
        } catch (err: any) {
            errorToast(err.message || "Login failed. Please try again.");
        }
        finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
   
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Đăng Nhập</h1>
                        <p className="text-blue-100">Chào mừng bạn quay trở lại</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">

                        <FormInput
                            label="Tài Khoản Email"
                            id="email"
                            type="email"
                            className="text-white"
                            value={email}
                            placeholder="Nhập tài khoản của bạn"
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                            }}
                              error={fieldErrors.email}
                        />   
                        <FormInput  
                            label="Mật Khẩu"
                            id="password"
                            type="password"
                            className="text-white"
                            value={password}
                            placeholder="Nhập mật khẩu của bạn"
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                            }}
                            error= {fieldErrors.password }
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
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                "Đăng Nhập"
                            )}
                        </Button>
                    </form>

                    <div className="bg-gray-50 dark:bg-slate-700 px-8 py-4 text-center border-t border-gray-200 dark:border-slate-600">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Chưa có tài khoản?{" "}
                            <a href="/auth/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                                Đăng ký ngay
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
      