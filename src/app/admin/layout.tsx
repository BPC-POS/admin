"use client";

import React, { useState } from 'react';
import AdminHeader from '../../components/admin/layouts/AdminHeader';
import AdminSidebar from '../../components/admin/layouts/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className={`fixed h-full transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <AdminSidebar isCollapsed={false} onToggle={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </div>

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <div className="fixed top-0 right-0 left-0 z-10">
          <div className={`${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
            <AdminHeader />
          </div>
        </div>
        <main className="flex-1 overflow-auto mt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;