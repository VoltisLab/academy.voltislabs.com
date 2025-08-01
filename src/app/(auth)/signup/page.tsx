"use client";
import React from "react";
import AuthForm from "@/components/auth/authForm";

const AuthPage: React.FC = () => {
  return (
    <AuthForm mode="verify" onSubmit={(data) => console.log("Signup", data)} />
  );
};

export default AuthPage;
