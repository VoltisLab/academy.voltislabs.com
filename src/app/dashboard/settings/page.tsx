import TabComponent from "@/components/myCourses/TabComponent";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import NotificationSettingsForm from "@/components/settings/NotificationSettingsForm";
import PreferencesForm from "@/components/settings/PreferencesForm";
import React from "react";

export default function Settings() {
  return (
    <div className="max-w-[90rem] space-y-10  mx-auto px-4 16 py-8">
      <h1 className="text-3xl  font-bold">Settings</h1>
      <TabComponent tabs={["General", "Password", "Notifications"]}>
        <PreferencesForm />
        <ChangePasswordForm />
        <NotificationSettingsForm />
      </TabComponent>
    </div>
  );
}
