"use client";

import { lazy, Suspense, useState } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
// Tạo placeholder component đơn giản thay vì import toàn bộ Loading component
const LoadingPlaceholder = () => (
  <div className="flex items-center justify-center p-8 bg-white/80 rounded-lg shadow-md w-full max-w-md animate-pulse">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lazy load login form
const LoginForm = lazy(() => import("@/components/forms/LoginForm"));

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthLayout>
      <Suspense fallback={<LoadingPlaceholder />}>
        <LoginForm setLoading={setIsLoading} />
      </Suspense>
    </AuthLayout>
  );
};

export default LoginPage;