"use client";

import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Facebook, Google } from "@mui/icons-material";
import Select from "../ui/Select";
import Checkbox from "../ui/Checkbox";
import Link from "next/link";

const RegisterForm: React.FC = () => {
  return (
    <div className="space-y-4 font-poppins">
      <h2 className="text-5xl font-poppins font-bold text-white text-center mb-4">
        Register
      </h2>

      <Input label="Your Full Name" />
      <div className="flex space-x-2">
        <Input label="Your Store Name" className="flex-1" />
        <Input label="Your Phone Number" className="flex-1" />
      </div>
      <div className="flex space-x-2">
        <Select
          label="Your Province/City?"
          className="flex-1"
          options={[
            { value: "hanoi", label: "Hanoi" },
            { value: "hcm", label: "Ho Chi Minh City" },
            { value: "danang", label: "Da Nang" },
          ]}
        />
        <Select
          label="Your Interested Product"
          className="flex-1"
          options={[
            { value: "fashion", label: "Fashion" },
            { value: "electronics", label: "Electronics" },
            { value: "household", label: "Household" },
          ]}
        />
      </div>
      <div className="flex items-center mb-4">
        <Checkbox />
        <p className="text-sm text-gray-200">
          I have read and agree to the{" "}
          <a href="#" className="text-amber-100 hover:underline">
            Privacy Policy
          </a>{" "}
          &{" "}
          <a href="#" className="text-amber-100 hover:underline">
            Terms of Use
          </a>{" "}
        </p>
      </div>
      <Button
        fullWidth
        className="bg-black hover:bg-white hover:text-black p-3 font-poppins font-bold text-2xl"
        style={{borderRadius: 12}}
      >
        REGISTER <span className="ml-2">→</span>
      </Button>

      <div className="text-center text-gray-500 mt-4 mb-2">
        or register with
      </div>
      <div className="flex justify-center space-x-2">
        <Button
          variant="outlined"
          startIcon={<Facebook />}
          className="flex-1 font-poppins bg-gray-500"
          style={{ borderRadius: 8 }}
        >
          Facebook
        </Button>
        <Button
          variant="outlined"
          startIcon={<Google />}
          className="flex-1 bg-white text-black font-poppins hover:text-white"
          style={{ borderRadius: 8 }}
        >
          Google
        </Button>
      </div>
      <div className="flex items-center justify-center space-x-2 mt-2">
        <div className="text-center text-white">Already have an account?</div>
        <Link
          href="/login"
          className="text-white hover:underline font-poppins font-bold"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
