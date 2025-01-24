'use client';

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Pass isSidebarOpen and handleToggleSidebar to Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />
            
            <main className={`${isSidebarOpen ? 'ml-64' : 'ml-[100]'} flex-1`}>
                <Header onToggleSidebar={handleToggleSidebar} />
                <div className="flex-1 p-2">
                    {children}
                </div>
            </main>
        </div>
    );
}
