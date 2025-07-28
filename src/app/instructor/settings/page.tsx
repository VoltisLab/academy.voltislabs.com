import TabComponent from "@/components/myCourses/TabComponent";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import NotificationSettingsForm from "@/components/settings/NotificationSettingsForm";
import PreferencesForm from "@/components/settings/PreferencesForm";
import React from "react";

export default function Settings() {
  return (
    <div className="p-5 mx-auto ">
      {/* <h1 className="text-lg font-bold">Settings</h1> */}
      <TabComponent tabs={["General", "Password", "Notifications"]}>
        <PreferencesForm />
        <ChangePasswordForm />
        <NotificationSettingsForm />
      </TabComponent>
    </div>
  );
}
