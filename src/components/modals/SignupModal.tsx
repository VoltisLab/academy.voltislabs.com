"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";
import { signUp, login } from "@/api/auth";
import { SignUpData, LoginData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define more specific error types
interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  general?: string;
}

const SignupModalContent: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("English (UK)");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Replace single error with more specific errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Track touched fields for better UX
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
    fullName: false
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
      fullName: false
    });
  }, [hasAccount]);

  if (!isOpen) return null;

  // Validate email format and domain
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if email belongs to allowed domains
  const isAllowedDomain = (email: string): boolean => {
    const allowedDomains = ['voltislab.com', 'academy.voltislab.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.includes(domain);
  };

  // Validate password strength
  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return undefined;
  };

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

  // Validate individual fields
  const validateField = (field: keyof FormErrors, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'email':
        if (!value) {
          newErrors.email = "Email is required";
        }
         else if (!isValidEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } 
        // else if (!isAllowedDomain(value)) {
        //   newErrors.email = "Sorry, this is an invalid email. Please use an email ending with @voltislab.com or @academy.voltislab.com";
        // } 
        else {
          delete newErrors.email;
        }
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
      fullName: !hasAccount ? true : false
    });
    
    if (!email) {
      newErrors.email = "Email is required";
    } 
    // else if (!isValidEmail(email)) {
    //   newErrors.email = "Please enter a valid email address";
    // } else if (!isAllowedDomain(email)) {
    //   newErrors.email = "Sorry, this is an invalid email. Please use an email ending with @voltislab.com or @academy.voltislab.com";
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
      };

      const result = await signUp(userData);

      if (result.register?.success) {
        // Close modal and redirect
        onClose();
        router.push("/dashboard");
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

      if (result.login?.success) {
        // Close modal and redirect
        onClose();
        router.push("/dashboard");
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

  // Enhanced error message for email domains
  const renderEmailError = () => {
    if (!touchedFields.email || !errors.email) return null;
    
    if (errors.email.includes("invalid email")) {
      return (
        <div className="text-red-500 text-xs mt-1">
          <p id="email-error" className="mb-1">{errors.email}</p>
          <p className="text-gray-600">Examples of valid emails:</p>
          <ul className="text-gray-600 pl-4 list-disc">
            <li>yourname@voltislab.com</li>
            <li>yourname@academy.voltislab.com</li>
          </ul>
        </div>
      );
    }
    
    return (
      <p id="email-error" className="text-red-500 text-xs mt-1">
        {errors.email}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-[30px] shadow-lg overflow-hidden w-full max-w-5xl flex border-5 border-white relative"
      >
        {/* Left side - Pink section */}
        <div className="bg-gradient-to-b from-[#DC4298] to-[#EAADCF] text-white p-8 w-[37%] relative">
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
          <h2 className="text-3xl font-bold mb-2">
            Welcome to
            <br />
            Voltis Labs University
          </h2>
          <p className="text-sm mb-12">
            Make your design looks more attractive with 3D abstract geometric
            digital art.
          </p>

          {/* 3D elements representation */}
          <div className="relative h-[51%] w-[165%] flex justify-center items-center">
            <div
              className={`absolute inset-0 z-10  ${
                !hasAccount ? "-left-32 -bottom-8" : "-left-24 -bottom-6"
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
        <div className="absolute h-full left-[37%] overflow-hidden w-12 -translate-x-6 z-">
          <div className="h-full w-16 rounded-l-[30px] bg-white"></div>
        </div>

        {/* Right side - Form */}
        <div className="py-16 px-28 flex-1 relative z-10">
          {/* Language Dropdown */}
          <div className="absolute top-2 right-4 flex items-center">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-transparent text-gray-400 pr-8 py-1 cursor-pointer text-sm font-medium"
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

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-left text-[#525252]">
              Welcome!
            </h2>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              type="button"
              className="flex-1 border border-gray-300 rounded-md py-2 font-bold px-3 flex justify-center items-center gap-2 text-[#A1A1A1] text-[12px]"
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
              className="flex-1 border border-gray-300 rounded-md py-2 px-3 font-bold flex justify-center items-center gap-2 text-[#A1A1A1] text-[12px]"
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
                {renderEmailError()}
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
              </div>
              <button
                type="submit"
                className={`w-full bg-[#DC4298] text-white py-4 rounded-lg font-medium hover:bg-pink-600 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-[#DC4298] hover:underline font-medium"
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
                {renderEmailError()}
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
                    className="text-sm text-gray-500 hover:text-pink-500"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className={`w-full bg-[#DC4298] text-white py-4 rounded-lg font-medium hover:bg-pink-600 transition-colors cursor-pointer ${
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
                  className="text-[#DC4298] hover:underline font-medium cursor-pointer"
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