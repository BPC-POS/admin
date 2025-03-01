"use client";

import { useState } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import LoginForm from "@/components/forms/LoginForm";
import Loading from "@/components/admin/Loading/Loading";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Loading isLoading={isLoading} />
      <AuthLayout>
        <LoginForm setLoading={setIsLoading} />
      </AuthLayout>
    </>
  );
};

export default LoginPage;