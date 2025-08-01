'use client';

import { useAuthModal } from '@/lib/AuthModalContext';
import Modal from '@/components/Modal';
import AuthForm from '@/components/auth/authForm';

export default function GlobalAuthModal() {
  const { isOpen, mode, email, closeModal } = useAuthModal();

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <AuthForm mode={mode} emailForVerify={email} onSubmit={(data) => console.log(data)} />
    </Modal>
  );
}
