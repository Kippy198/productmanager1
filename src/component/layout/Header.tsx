"use client"

import { useRouter } from "next/navigation";
import Button from "../ui/button";
type User = {
  name: string;
}
type HeaderProps = {
    user: User | null
}

export default function Header({user} : HeaderProps) {
  const router = useRouter();

  const handleLogout = async() => {
    await fetch("/api/logout", {
        method: "POST",
    });
    router.push("/auth/login");
    router.refresh();
  }
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="min-w-screen sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="bg-white rounded-lg p-2">
                <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.757 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM2 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.757 4.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" />
                </svg>
                </div>
                <span className="text-white font-bold text-xl">ProductManager</span>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
                <span  className="font-medium text-gray-700">
                    {user?.name}
                </span>
                <Button 
                    onClick={handleLogout} variable="danger">
                    Đăng xuất
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
