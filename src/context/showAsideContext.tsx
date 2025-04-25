"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AsideContextProps {
  showAside: boolean;
  toggleAside: () => void;
  setShowAside: (show: boolean) => void;
}

const AsideContext = createContext<AsideContextProps | undefined>(undefined);

export const AsideProvider = ({ children }: { children: ReactNode }) => {
  const [showAside, setShowAside] = useState(false);

  const toggleAside = () => setShowAside((prev) => !prev);

  return (
    <AsideContext.Provider value={{ showAside, toggleAside, setShowAside }}>
      {children}
    </AsideContext.Provider>
  );
};

export const useAside = () => {
  const context = useContext(AsideContext);
  if (!context) {
    throw new Error("useAside must be used within an AsideProvider");
  }
  return context;
};
