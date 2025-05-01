"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";
import { signUp, login, sendVerificationCode } from "@/api/auth/auth";
import { SignUpData, LoginData, FormErrors } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import { isAllowedDomain, isValidEmail, SignupModalProps, validatePassword } from "@/lib/utils";
import Link from "next/link";
import { usePageLoading } from "@/hooks/UsePageLoading";


const SignupModalContent: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("English (UK)");
  const [loading, setLoading] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [sendingCode, setSendingCode] = useState<boolean>(false);
  const [codeExpiry, setCodeExpiry] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { withLoading } = usePageLoading();
  // New state to track if user is in instructor or student mode
  const [isInstructor, setIsInstructor] = useState<boolean>(false);
  
  // Replace single error with more specific errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Track touched fields for better UX
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
    fullName: false,
    otpCode: false
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Function to handle outside clicks
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    // Clean up event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Reset form state when toggling between login and signup
  useEffect(() => {
    setErrors({});
    setTouchedFields({
      email: false,
      password: false,
      fullName: false,
      otpCode: false
    });
    setCodeSent(false);
    setOtpCode("");
  }, [hasAccount]);

  // Timer for OTP expiration
  useEffect(() => {
    if (!codeExpiry) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = codeExpiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft(0);
        setCodeSent(false);
        clearInterval(timer);
      } else {
        setTimeLeft(Math.floor(diff / 1000));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [codeExpiry]);

  // Toggle between instructor and student mode
  const toggleUserType = () => {
    setIsInstructor(!isInstructor);
  };

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: keyof FormErrors
  ) => {
    const value = e.target.value;
    setter(value);
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Validate on change for better UX
    validateField(field, value);
  };

  // Handle sending verification code
  const handleSendCode = async () => {
    // Validate email first
    if (!validateField('email', email)) {
      return;
    }

    setSendingCode(true);
    
    try {
      const result = await sendVerificationCode(email);
      
      if (result.success) {
        setCodeSent(true);
        // Set expiry time to 5 minutes from now
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 5);
        setCodeExpiry(expiry);
        setTimeLeft(300); // 5 minutes in seconds
        
        // Show success message
        setErrors(prev => ({ ...prev, emailVerification: "Verification code sent successfully. Code expires in 5 minutes." }));
      } else {
        // Handle error
        setErrors(prev => ({ 
          ...prev, 
          emailVerification: result.error || "Failed to send verification code. Please try again." 
        }));
      }
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      setErrors(prev => ({ 
        ...prev, 
        emailVerification: error.message || "Failed to send verification code. You may have reached the rate limit (3 requests per hour)." 
      }));
    } finally {
      setSendingCode(false);
    }
  };

  // Format seconds to mm:ss
  const formatTimeLeft = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Validate individual fields
  const validateField = (field: keyof FormErrors, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'email':
        if (!value) {
          newErrors.email = "Email is required";
        } 
        // else if (!isValidEmail(value)) {
        //   newErrors.email = "Please enter a valid email address";
        // } 
        // else if (isInstructor && !isAllowedDomain(value)) {
        //   newErrors.email = "Sorry, this is an invalid email. Instructors must use an email ending with @voltislab.com or @academy.voltislab.com";
        // } 
        // else {
        //   delete newErrors.email;
        // }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = "Password is required";
        } else {
          const passwordError = validatePassword(value);
          if (passwordError) {
            newErrors.password = passwordError;
          } else {
            delete newErrors.password;
          }
        }
        break;
        
      case 'fullName':
        if (!value) {
          newErrors.fullName = "Full name is required";
        } else if (value.trim().length < 2) {
          newErrors.fullName = "Name must be at least 2 characters";
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'otpCode':
        if (!value) {
          newErrors.otpCode = "Verification code is required";
        } else if (value.trim().length < 4) {
          newErrors.otpCode = "Invalid verification code";
        } else {
          delete newErrors.otpCode;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate all fields before form submission
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Mark all fields as touched
    setTouchedFields({
      email: true,
      password: true,
      fullName: !hasAccount ? true : false,
      otpCode: !hasAccount ? true : false
    });
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    } 
    // else if (isInstructor && !isAllowedDomain(email)) {
    //   newErrors.email = "Sorry, this is an invalid email. Instructors must use an email ending with @voltislab.com or @academy.voltislab.com";
    // }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!hasAccount) {
      // Only validate password strength on signup
      const passwordError = validatePassword(password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }
    
    if (!hasAccount && !fullName) {
      newErrors.fullName = "Full name is required";
    }

    if (!hasAccount && !otpCode) {
      newErrors.otpCode = "Verification code is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup submission
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userData: SignUpData = {
        fullName,
        email,
        password,
        otpCode,
        isInstructor,
      };

      const result = await signUp(userData);

      if (result.register?.success) {
        // Show the login screen
        setHasAccount(true);
      } else {
        // Handle specific API errors
        if (result.register?.errors?.length > 0) {
          // Map API errors to specific fields if possible
          result.register.errors.forEach(errorMsg => {
            if (errorMsg.toLowerCase().includes("email")) {
              setErrors(prev => ({ ...prev, email: errorMsg }));
            } else if (errorMsg.toLowerCase().includes("password")) {
              setErrors(prev => ({ ...prev, password: errorMsg }));
            } else if (errorMsg.toLowerCase().includes("name")) {
              setErrors(prev => ({ ...prev, fullName: errorMsg }));
            } else if (errorMsg.toLowerCase().includes("code") || errorMsg.toLowerCase().includes("otp")) {
              setErrors(prev => ({ ...prev, otpCode: errorMsg }));
            } else {
              setErrors(prev => ({ ...prev, general: errorMsg }));
            }
          });
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
      }
    } catch (error: any) {
      // Handle network errors or unexpected exceptions
      console.error("Signup error:", error);
      
      if (!navigator.onLine) {
        setErrors({ general: "Network error. Please check your internet connection." });
      } else {
        setErrors({ 
          general: error.message || "An unexpected error occurred. Please try again later." 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle login submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const credentials: LoginData = {
        email,
        password,
      };

      const result = await login(credentials);
      console.log(result)

      if (result.login?.success) {
        // onClose();
        // Redirect based on user type
        router.push(result?.login?.user?.isInstructor ? "/instructor" : "/dashboard");
      } else {
        // Handle specific login errors
        if (result.login?.errors?.length > 0) {
          const loginError = result.login.errors[0];
          
          // Map common login errors to appropriate fields
          if (loginError.toLowerCase().includes("email") || loginError.toLowerCase().includes("not found")) {
            setErrors({ email: loginError });
          } else if (loginError.toLowerCase().includes("password") || loginError.toLowerCase().includes("incorrect")) {
            setErrors({ password: loginError });
          } else {
            setErrors({ general: loginError });
          }
        } else {
          setErrors({ general: "Invalid email or password. Please try again." });
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle different error scenarios
      if (!navigator.onLine) {
        setErrors({ general: "Network error. Please check your internet connection." });
      } else if (error.message?.includes("rate")) {
        setErrors({ general: "Too many login attempts. Please try again later." });
      } else if (error.message?.includes("timeout")) {
        setErrors({ general: "Server timeout. Please try again later." });
      } else {
        setErrors({ 
          general: error.message || "An unexpected error occurred. Please try again later." 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to get input border class based on validation state
  const getInputClass = (field: keyof FormErrors) => {
    const baseClass = "w-full px-0 py-2 border-t-0 border-r-0 border-l-0 text-[14px] border-b focus:outline-none text-gray-700";
    
    if (touchedFields[field as keyof typeof touchedFields] && errors[field]) {
      return `${baseClass} border-red-500 focus:border-b-2 focus:border-red-500`;
    }
    
    return `${baseClass} border-gray-300 focus:border-b-2 focus:border-pink-500`;
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
        <div
          ref={modalRef}
          className="bg-white rounded-[30px] shadow-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row border-5 border-white relative"
        >
          {/* Left side - Pink section */}
          <div className="bg-gradient-to-b from-[#313273] to-[#4B4C8D] text-white p-8 md:w-[37%] w-full relative md:block hidden">
          <div className="mb-4">
            <div className="h-8 w-8 bg-white rounded">
              <Image
                src={"/auth/logo.png"}
                alt="3D geometric shapes"
                height={40}
                width={40}
                objectFit="contain"
              />
            </div>
          </div>
          <h2 className="xl:text-3xl text-xl font-bold mb-2">
            Welcome to 
            <br />
            Voltis Labs University
          </h2>
          <p className="text-sm mb-12">
            Begin your journey into a world of endless possibilities exploring our courses
          </p>

          {/* 3D elements representation */}
          <div className="relative xl:h-[51%] h-[40%] xl:w-[165%] w-[135%]  flex justify-center items-center">
            <div
              className={`absolute inset-0 z-10  ${
                !hasAccount ? "xl:-left-32 xl:-bottom-8" : "xl:-left-24 xl-bottom-6"
              }`}
            >
              <Image
                src={"/auth/authsvg.png"}
                alt="3D geometric shapes"
                layout="fill"
                objectFit="contain"
                className="scale-125"
              />
            </div>
          </div>
        </div>

        {/* Curved edge overlay - Fixed positioning */}
        <div className="absolute h-full left-[37%] overflow-hidden w-12 -translate-x-6 md:block hidden">
          <div className="h-full w-16 rounded-l-[30px] bg-white"></div>
        </div>

        {/* Right side - Form */}
        <div className="xl:py-16 md:px-10 xl:px-28 px-5 flex-1 relative z-10">
          {/* Language Dropdown */}
          <div className="absolute top-2 right-4 flex items-center">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-transparent text-gray-400 pr-8 py-1 cursor-pointer text-[12px] md:text-sm font-medium"
              >
                <option value="English (UK)">English (UK)</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
              </select>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-10 flex flex-row justify-between items-center xl:mt-0 mt-10">
            <h2 className="md:text-3xl text-xl font-bold text-left text-[#525252]">
              {!hasAccount ? (isInstructor ? "Instructor Signup" : "Student Signup") : "Login"}
            </h2>
            {!hasAccount && (
              <button className="text-sm font-bold bg-[#313273] p-2 shadow-md cursor-pointer rounded-md hover:bg-indigo-800 text-white"
              onClick={toggleUserType}>
              {(isInstructor ? "Student Signup" : "Instructor Signup")}
              </button>
            )}
          </div>

          <div className="flex gap-4 mb-8">
            <button
              type="button"
              className="flex-1 border border-gray-300 rounded-md py-1 xl:py-2 font-bold px-1 md:px-3 flex justify-center items-center md:gap-2 gap-1 text-[#A1A1A1] text-[10px] xl:text-[12px]"
            >
              <div className="h-6 w-6 bg-white rounded">
                <Image
                  src={"/auth/google.png"}
                  alt="3D geometric shapes"
                  height={40}
                  width={40}
                  objectFit="contain"
                />
              </div>
              Continue with Google
            </button>
            <button
              type="button"
              className="flex-1 border border-gray-300 rounded-md py-1 xl:py-2 font-bold px-1 md:px-3 flex justify-center items-center md:gap-2 gap-1 text-[#A1A1A1] text-[10px] xl:text-[12px]"
            >
              <div className="h-5 w-5 bg-white rounded ">
                <Image
                  src={"/auth/facebook.png"}
                  alt="3D geometric shapes"
                  height={40}
                  width={40}
                  objectFit="contain"
                />
              </div>
              Continue with Facebook
            </button>
          </div>

            {/* Improved OR divider with longer lines */}
            <div className="flex items-center mb-8 w-full justify-center ">
              <span className="text-gray-500 text-sm font-medium">- OR -</span>
            </div>

            {/* General error message display */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4 text-sm">
                {errors.general}
              </div>
            )}

            {!hasAccount ? (
              <form className="space-y-6 z-20" onSubmit={handleSignup}>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className={getInputClass('fullName')}
                    value={fullName}
                    onChange={(e) => handleInputChange(e, setFullName, 'fullName')}
                    aria-invalid={touchedFields.fullName && Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "fullname-error" : undefined}
                  />
                  {touchedFields.fullName && errors.fullName && (
                    <p id="fullname-error" className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div className="mb-6 relative">
                <div className="flex items-center relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className={getInputClass('email')}
                    value={email}
                    onChange={(e) => handleInputChange(e, setEmail, 'email')}
                    aria-invalid={touchedFields.email && Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  <div className="absolute right-0 bottom-2">
                    <button
                      type="button"
                      className={`text-sm font-medium px-3 py-1 rounded
                        ${codeSent 
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-[#313273] hover:text-indigo-900"
                        }
                        ${!isValidEmail(email) ? "opacity-50 cursor-not-allowed" : ""}
                        ${sendingCode ? "opacity-50 cursor-wait" : ""}
                      `}
                      onClick={handleSendCode}
                      disabled={codeSent || !isValidEmail(email) || sendingCode}
                    >
                      {sendingCode 
                        ? "Sending..." 
                        : codeSent 
                          ? `Resend (${formatTimeLeft(timeLeft)})` 
                          : "Send Code"}
                    </button>
                  </div>
                </div>
                {touchedFields.email && errors.email && (
                  <p id="email-error" className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
                {errors.emailVerification && (
                  <p className={`text-xs mt-1 ${errors.emailVerification.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                    {errors.emailVerification}
                  </p>
                )}
              </div>
                
                {/* OTP Code field - only shown after code is sent */}
                {codeSent && (
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Verification Code"
                      className={getInputClass('otpCode')}
                      value={otpCode}
                      onChange={(e) => handleInputChange(e, setOtpCode, 'otpCode')}
                      aria-invalid={touchedFields.otpCode && Boolean(errors.otpCode)}
                      aria-describedby={errors.otpCode ? "otp-error" : undefined}
                    />
                    {touchedFields.otpCode && errors.otpCode && (
                      <p id="otp-error" className="text-red-500 text-xs mt-1">
                        {errors.otpCode}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      Code expires in {formatTimeLeft(timeLeft)}
                    </p>
                  </div>
                )}
                
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Password"
                    className={getInputClass('password')}
                    value={password}
                    onChange={(e) => handleInputChange(e, setPassword, 'password')}
                    aria-invalid={touchedFields.password && Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  {touchedFields.password && errors.password && (
                    <p id="password-error" className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className={`w-full bg-[#313273] text-white py-4 rounded-lg font-medium hover:bg-indigo-800 transition-colors ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading || !codeSent}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-indigo-800 hover:underline font-medium"
                    onClick={() => setHasAccount(true)}
                    disabled={loading}
                  >
                    Login
                  </button>
                </p>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className={getInputClass('email')}
                    value={email}
                    onChange={(e) => handleInputChange(e, setEmail, 'email')}
                    aria-invalid={touchedFields.email && Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {touchedFields.email && errors.email && (
                    <p id="email-error" className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Password"
                    className={getInputClass('password')}
                    value={password}
                    onChange={(e) => handleInputChange(e, setPassword, 'password')}
                    aria-invalid={touchedFields.password && Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  {touchedFields.password && errors.password && (
                    <p id="password-error" className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      className="text-sm text-gray-500 hover:text-indigo-800"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-[#313273] text-white py-4 rounded-lg font-medium hover:bg-indigo-800 transition-colors cursor-pointer ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="text-indigo-800 hover:underline font-medium cursor-pointer"
                    onClick={() => setHasAccount(false)}
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Wrap the component with ApolloProvider
const SignupModal: React.FC<SignupModalProps> = (props) => {
  return (
    <ApolloProvider client={apolloClient}>
      <SignupModalContent {...props} />
    </ApolloProvider>
  );
};

export default SignupModal;