"use client"

import { lazy, Suspense } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";

// Loading placeholder
const LoadingPlaceholder = () => (
  <div className="flex items-center justify-center p-8 bg-white/80 rounded-lg shadow-md w-full max-w-md animate-pulse">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lazy load register form
const RegisterForm = lazy(() => import("@/components/forms/RegisterForm"));

const RegisterPage = () => {
  return (
    <AuthLayout>
      <Suspense fallback={<LoadingPlaceholder />}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
};

export default RegisterPage;