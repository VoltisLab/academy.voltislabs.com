// First, update your AddSectionButton.tsx to accept the addSection function directly:
"use client";
import React from 'react';
import { Plus } from "lucide-react";

interface AddSectionButtonProps {
  addSection: () => void;
}

export default function AddSectionButton({ addSection }: AddSectionButtonProps) {
  return (
    <button
      onClick={addSection} // Call the addSection function directly
      className="flex items-center gap-2 py-2 px-4 text-sm text-indigo-600 font-medium border border-gray-200 rounded-md hover:bg-gray-50"
    >
      <Plus className="w-4 h-4" />
      <span>Section</span>
    </button>
  );
}