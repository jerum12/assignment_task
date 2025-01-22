
'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

import { useState } from 'react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-semibold">Dashboard Content</h1>
          <p>Welcome to your dashboard. Add your content here.</p>
          <section className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded shadow p-6">
              <h3 className="text-lg font-bold mb-2">Recent Activity</h3>
              <p className="text-gray-600">No recent activity found.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded shadow p-6">
              <h3 className="text-lg font-bold mb-2">Notifications</h3>
              <p className="text-gray-600">You have no new notifications.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded shadow p-6">
              <h3 className="text-lg font-bold mb-2">Tasks</h3>
              <p className="text-gray-600">All tasks are completed. Great job!</p>
            </div>
          </div>
        </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
