"use client";

import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
      <div className="flex justify-center items-center h-screen bg-cover bg-center"
          style={{ backgroundImage: `url('assets/images/background.jpg')`}}
        >
        <div className="shadow-lg w-[400px]">
          {children}
        </div>
      </div>
    );
  };

export default AuthLayout;