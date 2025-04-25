"use client"
import { useState } from "react";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Perform password update logic here
    console.log({ oldPassword, newPassword });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm space-y-6 text-sm text-gray-700"
    >
      <div>
        <label className="block mb-1 font-medium">Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Placeholder"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Input your new password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Retype New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Input again your new password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <button
        type="submit"
        className="bg-[#2E2C6F] text-white px-6 py-2 rounded-lg font-medium"
      >
        Save Changes
      </button>
    </form>
  );
}
