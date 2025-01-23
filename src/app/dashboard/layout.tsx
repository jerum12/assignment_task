
'use client';

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
      const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
      };

  return (
    <div className="flex h-screen bg-gray-100">
          <Toaster
           toastOptions={{
            success: {
              style: {
                border: "1px solid #4ade80", // Light green border
                padding: "16px",
                color: "#14532d", // Dark green text
                backgroundColor: "#d1fae5", // Light greenish background
              },
              iconTheme: {
                primary: "#22c55e", // Bright green icon
                secondary: "#ffffff", // White inner icon
              },
            },
            error: {
                style: {
                    border: '1px solid #f87171', // Light red border
                    padding: '16px',
                    color: '#b91c1c', // Darker red text
                    backgroundColor: '#fef2f2', // Light reddish background
                  },
                  iconTheme: {
                    primary: '#b91c1c', // Dark red icon color
                    secondary: '#fff', // White inner icon
                  },
              },
          }}
           position="top-right" reverseOrder={false} />
      {/* Sidebar */}
      <Sidebar  />
      <main className="ml-64 flex-1">
      <Header onToggleSidebar={handleToggleSidebar} />
      <div className="flex-1 p-2">
            {children}
      </div>
    </main>

     
    </div>
  );
}
