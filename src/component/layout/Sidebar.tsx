"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// type User = 
// {
//     name: string;
// }
// | null;
// type SidebarProps = {
//     user: User;
// }

export default function Sidebar() {
    const pathname = usePathname();
    const menu = [
        {name: "Dashboard", path : "/dashboard/dashboard"},
        {name: "Products", path: "/dashboard/products"},
    ];

    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
            <nav className="flex-1 p-4 space-y-2">
                {menu.map((item) => (
                    <Link key = {item.path} href={item.path} 
                    className={`block px-4 py-2 rounded-lg transition ${
                    pathname === item.path
                        ? "bg-blue-600"
                        : "hover:bg-gray-700"
                    }`}>
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    )
}