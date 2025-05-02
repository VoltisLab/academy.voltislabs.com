"use client";
import React from 'react';
import { Plus } from "lucide-react";

interface AddSectionButtonProps {
  addSection: () => void;
}

export default function AddSectionButton({ addSection }: AddSectionButtonProps) {
  return (
    <button
      onClick={addSection}
      className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
    >
      <Plus className="w-5 h-5 mr-2" />
      <span className="font-medium">Add Section</span>
    </button>
  );
}