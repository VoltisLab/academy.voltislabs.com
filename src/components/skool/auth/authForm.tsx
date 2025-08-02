'use client';

import { useAuthModal } from '@/lib/AuthModalContext';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from 'react-icons/ai';

type Mode = 'login' | 'signup' | 'verify' | 'forgot';

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData extends LoginFormData {
  firstName: string;
  lastName: string;
}

interface VerifyFormData {
  code: string;
}

interface ForgotFormData {
  email: string;
}

type AuthFormData =
  | LoginFormData
  | SignupFormData
  | VerifyFormData
  | ForgotFormData;

interface SkoolAuthFormProps {
  mode: Mode;
  onSubmit?: (data: AuthFormData) => void;
  emailForVerify?: string;
}

const AuthForm: React.FC<SkoolAuthFormProps> = ({
  mode,
  onSubmit,
  emailForVerify,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendCounter, setResendCounter] = useState(60);
  const { openModal, closeModal } = useAuthModal();


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'verify' && resendCounter > 0) {
      timer = setTimeout(() => setResendCounter(resendCounter - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCounter, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: AuthFormData =
      mode === 'login'
        ? { email, password }
        : mode === 'signup'
        ? { firstName, lastName, email, password }
        : mode === 'verify'
        ? { code }
        : { email };

    onSubmit?.(formData);
  };

  return (
    <div className="h-fit flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="w-full min-w-[26rem] bg-white rounded-xl shadow-sm border border-gray-200 px-10 py-12">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">
              <span className="text-blue-600">s</span>
              <span className="text-red-500">k</span>
              <span className="text-yellow-500">o</span>
              <span className="text-green-500">o</span>
              <span className="text-blue-600">l</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {{
                  login: 'Log in to Skool',
                  signup: 'Sign up for Skool',
                  verify: 'We sent you a code',
                  forgot: 'Forgot Password',
                }[mode]}
              </h2>
              {mode === 'verify' && (
                <p className="text-sm mt-1 text-gray-600">
                  Enter it below to log in using <br />
                  <span className="font-medium text-black">
                    {emailForVerify || email}
                  </span>
                </p>
              )}
              {mode === 'forgot' && (
                <p className="text-sm mt-1 text-gray-600">
                  Enter your email address and we&apos;ll send you a link to reset
                  your password.
                </p>
              )}
            </div>

            {/* Sign up fields */}
            {mode === 'signup' && (
              <>
                <InputField
                  label="First Name"
                  value={firstName}
                  setValue={setFirstName}
                />
                <InputField
                  label="Last Name"
                  value={lastName}
                  setValue={setLastName}
                />
              </>
            )}

            {/* Email */}
            {mode !== 'verify' && (
              <InputField
                label="Email"
                type="email"
                value={email}
                setValue={setEmail}
              />
            )}

            {/* Password */}
            {(mode === 'login' || mode === 'signup') && (
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                setValue={setPassword}
                icon={
                  showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )
                }
                onIconClick={() => setShowPassword(!showPassword)}
              />
            )}

            {/* Code */}
            {mode === 'verify' && (
              <InputField label="Code" value={code} setValue={setCode} />
            )}

            {/* Forgot link */}
            {mode === 'login' && (
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => openModal("forgot")}
                  className="text-sm cursor-pointer text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
                 <button
                  onClick={() => openModal("verify", "john@gmail.com")}
                  className="text-sm cursor-pointer text-blue-600 hover:underline"
                >
                  login with code
                </button>
              </div>
            )}

            {/* Resend countdown */}
            {mode === 'verify' && (
              <p className="text-center text-sm text-gray-500">
                Didn’t get the email? Resend in {resendCounter}s
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg"
            >
              {{
                login: 'LOG IN',
                signup: 'SIGN UP',
                verify: 'LOG IN',
                forgot: 'EMAIL ME',
              }[mode]}
            </button>

            {/* Switch mode */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="text-center text-sm text-gray-600">
                {mode === 'login'
                  ? "Don't have an account? "

                  : 'Already have an account? '}
                  {
                    mode === "login"?
                <Link
                  onClick={closeModal}
                  href={ '/create-account' }
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up for free
                </Link> : 
                <button onClick={() =>openModal("login")} className="text-blue-600 cursor-pointer hover:underline font-medium">
                    login
                </button>
                  }
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Input Field
const InputField = ({
  label,
  value,
  setValue,
  type = 'text',
  icon,
  onIconClick,
}: {
  label: string;
  value: string;
  setValue: (val: string) => void;
  type?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}) => (
  <div className="relative">
    <input
      id={label}
      name={label}
      type={type}
      value={value}
      required
      onChange={(e) => setValue(e.target.value)}
      placeholder={label}
      className="peer w-full px-4 py-2 border focus:border-2 border-gray-200 rounded-sm bg-white text-gray-900 placeholder-transparent focus:outline-none focus:border-gray-800"
    />
    <label
      htmlFor={label}
      className="absolute left-4 -top-2.5 bg-white px-1 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-700"
    >
      {label}
    </label>
    {value && (
      <button
        type="button"
        onClick={() => setValue('')}
        className="absolute inset-y-0 right-8 pr-3 flex items-center"
      >
        <AiOutlineClose className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      </button>
    )}
    {icon && (
      <button
        type="button"
        onClick={onIconClick}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        {icon}
      </button>
    )}
  </div>
);

export default AuthForm;
