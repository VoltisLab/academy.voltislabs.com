"use client";
import React from "react";
import AuthForm from "@/components/auth/authForm";

const AuthPage: React.FC = () => {
  return (
    <div className="w-full h-screen fixed top-0 left-0 z-[1000] bg-[rgb(248,247,245)] flex items-center justify-center ">
      <AuthForm
        mode="login"
        onSubmit={(data) => console.log("Login", data)}
      />
    </div>
  );
};

export default AuthPage;
