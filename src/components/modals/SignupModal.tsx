'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('English (UK)');
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle outside clicks
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    // Clean up event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(e.target.value);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-[30px] shadow-lg overflow-hidden w-full max-w-5xl flex border-5 border-white relative">
        {/* Left side - Pink section */}
        <div className="bg-gradient-to-b from-[#DC4298] to-[#EAADCF] text-white p-8 w-[37%] relative">
          <div className="mb-4">
            <div className="h-8 w-8 bg-white rounded">
              {/* Logo placeholder */}
              <Image 
                src={'/auth/logo.png'} 
                alt='3D geometric shapes' 
                height={40}
                width={40}
                objectFit="contain"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">3D Models of<br />Abstract Digital Art</h2>
          <p className="text-sm mb-12">Make your design looks more attractive with 3D abstract geometric digital art.</p>
         
          {/* 3D elements representation */}
          <div className="relative h-[51%] w-[165%] flex justify-center items-center">
            <div className={`absolute inset-0 z-10  ${!hasAccount? "-left-32 -bottom-8" : "-left-24 -bottom-6"}`}>
              <Image 
                src={'/auth/authsvg.png'}
                alt='3D geometric shapes' 
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
         
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-left text-[#525252]">Welcome!</h2>
          </div>
         
          <div className="flex gap-4 mb-8">
            <button className="flex-1 border border-gray-300 rounded-md py-2 font-bold px-3 flex justify-center items-center gap-2 text-[#A1A1A1] text-[12px]">
            <div className="h-6 w-6 bg-white rounded">
              {/* Logo placeholder */}
              <Image 
                src={'/auth/google.png'} 
                alt='3D geometric shapes' 
                height={40}
                width={40}
                objectFit="contain"
              />
            </div>
              Continue with Google
            </button>
            <button className="flex-1 border border-gray-300 rounded-md py-2 px-3 font-bold flex justify-center items-center gap-2 text-[#A1A1A1] text-[12px]">
              <div className="h-5 w-5 bg-white rounded ">
              {/* Logo placeholder */}
              <Image 
                src={'/auth/facebook.png'} 
                alt='3D geometric shapes' 
                height={40}
                width={40}
                objectFit="contain"
              />
            </div>
              Continue with Facebook
            </button>
          </div>
         
          {/* Improved OR divider with longer lines */}
          <div className="flex items-center mb-8 w-full justify-center " >
            <span className="text-gray-500 text-sm font-medium">- OR -</span>
          </div>
         
          {!hasAccount ? (
            <form className="space-y-6 z-20" onSubmit={(e) => e.preventDefault()}>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-0 py-2 border-t-0 border-r-0 border-l-0 text-[14px] border-b border-gray-300 focus:border-b-2 focus:border-pink-500 focus:outline-none text-gray-700"
                  value={fullName}
                  onChange={(e) => handleInputChange(e, setFullName)}
                />
              </div>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-0 py-2 border-t-0 border-r-0 border-l-0 border-b text-[14px] border-gray-300 focus:border-b-2 focus:border-pink-500 focus:outline-none text-gray-700"
                  value={email}
                  onChange={(e) => handleInputChange(e, setEmail)}
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-0 py-2 border-t-0 border-r-0 border-l-0 text-[14px] border-b border-gray-300 text-[14px] focus:border-b-2 focus:border-pink-500 focus:outline-none text-gray-700"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#DC4298] text-white py-4 rounded-lg font-medium hover:bg-pink-600 transition-colors"
              >
                Create Account
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account? {" "}
                <button
                  type="button"
                  className="text-[#DC4298] hover:underline font-medium"
                  onClick={() => setHasAccount(true)}
                >
                  Login
                </button>
              </p>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-0 py-2 border-t-0 border-r-0 border-l-0 border-b border-gray-300 focus:border-b-2 focus:border-pink-500 focus:outline-none text-gray-700"
                  value={email}
                  onChange={(e) => handleInputChange(e, setEmail)}
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-0 py-2 border-t-0 border-r-0 border-l-0 border-b border-gray-300 focus:border-b-2 focus:border-pink-500 focus:outline-none text-gray-700"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#DC4298] text-white py-4 rounded-lg font-medium hover:bg-pink-600 transition-colors cursor-pointer"
              >
                Login
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">
                Don&apos;t have an account? {" "}
                <button
                  type="button"
                  className="text-[#DC4298] hover:underline font-medium cursor-pointer"
                  onClick={() => setHasAccount(false)}
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

export default SignupModal;