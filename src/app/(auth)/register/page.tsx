"use client"

import AuthLayout from "@/components/layouts/AuthLayout";
import RegisterForm from "@/components/forms/RegisterForm";

const RegisterPage = () => {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
};

export default RegisterPage;