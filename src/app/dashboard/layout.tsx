import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Header from "@/src/component/layout/Header";
import Sidebar from "@/src/component/layout/Sidebar";
import React from "react";

type User = {
    name: string;
}

export default async function DashboardLayout({children} : { children: React.ReactNode}) 
    {
        const cookie = await cookies();
        const tokenCookie = cookie.get("token");
        const token = tokenCookie?.value;

        let user: User | null = null;
        if(token) {
            try {
                user = jwt.verify(token, process.env.JWT_SECRET!) as User;

            } catch (error) {
                user = null;
            }
        }

        return (
            <div className=" min-h-screen">
                <Header user= {user} />
                <div className="flex">
                    <Sidebar/>
                    <main className="flex-1 p-6 bg-gray-50">
                        {children}  
                    </main>
                </div>
                
            </div>
        )
    }