"use client";

import React from 'react';
import POSHeader from '@/components/pos/layout/POSHeader';
interface PosLayoutProps {
  children: React.ReactNode;
}

const PosLayout: React.FC<PosLayoutProps> = ({ children }) => {
  // const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarCollapsed(!isSidebarCollapsed);
  // };

  return (
    <div className="flex min-h-screen bg-gray-100">
        <main className="flex-1 overflow-auto">
          <POSHeader />
          {children}
        </main>
    </div>
  );
};

export default PosLayout;