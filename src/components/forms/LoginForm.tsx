"use client";

import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import {
  VisibilityOff,
  Visibility,
  Facebook,
  Google,
  AccountCircle,
  Key,
} from "@mui/icons-material";
import IconButton from "../ui/IconButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  setLoading?: (isLoading: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLoading }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClickHome = () => {
    if (setLoading) setLoading(true);
    
    // Giả lập thời gian xử lý đăng nhập
    setTimeout(() => {
      // Đặt timeout để đảm bảo hiệu ứng fade out hoàn tất trước khi chuyển trang
      setTimeout(() => {
        if (setLoading) setLoading(false);
      }, 700);
      router.push('/admin/dashboard');
    }, 1500);
  }

  return (
    <div className="font-poppins p-0 m-0">
      <h2 className="text-5xl font-popins text-center mb-4 text-white font-bold">
        Your Store
      </h2>
      <Input
        startIcon={<AccountCircle />}
        className="mt-4"
        style={{ fontFamily: "Poppins" }}
        label="Email/Phone Number"
      />
      <div className="relative">
        <Input
          startIcon={<Key />}
          className="mt-4"
          label="Password"
          type={showPassword ? "text" : "password"}
        />
        <IconButton
          onClick={togglePasswordVisibility}
          size="small"
          className="mt-5 mr-2"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          {showPassword ? (
            <VisibilityOff fontSize="small" />
          ) : (
            <Visibility fontSize="small" />
          )}
        </IconButton>
      </div>
      <div className="flex justify-end text-white text-sm mb-4 mt-3">
        <a href="#" className="hover:underline" onClick={handleClickHome}>
          Forgot password?
        </a>
      </div>
      <Button
        fullWidth
        className="bg-black hover:bg-white hover:text-black p-3 font-poppins font-bold text-2xl"
        style={{borderRadius: 12}}
        onClick={handleClickHome}
      >
        LOGIN
      </Button>

      <div className="text-center text-gray-500 mt-4 mb-2">Or login with</div>
      <div className="flex justify-center space-x-2">
        <Button
          variant="outlined"
          startIcon={<Facebook />}
          className="flex-1 font-poppins bg-gray-500"
          style={{borderRadius: 8}}
        >
          Facebook
        </Button>
        <Button
          variant="outlined"
          startIcon={<Google />}
          className="flex-1 bg-white text-black font-poppins hover:text-white"
          style={{borderRadius: 8}}
        >
          Google
        </Button>
      </div>
      <div className="flex items-center justify-center space-x-2 mt-4">
        <div className="text-center text-gray-20">{"Don't have an account?"}</div>
        <Link href="/register" className="text-white hover:underline font-bold">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
