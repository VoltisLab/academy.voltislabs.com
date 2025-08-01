'use client';

import React, { createContext, useContext, useState } from 'react';

type AuthMode = 'login' | 'signup' | 'verify' | 'forgot';

interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthMode;
  email?: string;
  openModal: (mode: AuthMode, email?: string) => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used within AuthModalProvider');
  return context;
};

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState<string | undefined>();

  const openModal = (newMode: AuthMode, userEmail?: string) => {
    setMode(newMode);
    setEmail(userEmail);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEmail(undefined);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, email, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};
