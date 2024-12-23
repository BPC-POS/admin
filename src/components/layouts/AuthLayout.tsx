import React, { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
      <div className="flex justify-center items-start  bg-cover bg-center bg-transparent"
          >
        <div className="bg-transparent backdrop-blur-2xl p-8 rounded-lg shadow-lg w-[400px] border-2"
       style={{ border: '2px solid rgba(225, 255, 255, .2)' }}
        >
          {children}
        </div>
      </div>
    );
  };

export default AuthLayout;