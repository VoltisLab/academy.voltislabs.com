// hooks/useModal.tsx
import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<{sectionId: string, lectureId: string} | null>(null);
  
  const open = (sectionId: string, lectureId: string) => {
    setActiveSection({ sectionId, lectureId });
    setIsOpen(true);
  };
  
  const close = () => {
    setIsOpen(false);
    setActiveSection(null);
  };
  
  const toggle = (sectionId: string, lectureId: string) => {
    if (activeSection?.sectionId === sectionId && activeSection?.lectureId === lectureId && isOpen) {
      close();
    } else {
      open(sectionId, lectureId);
    }
  };
  
  return {
    isOpen,
    activeSection,
    open,
    close,
    toggle
  };
};