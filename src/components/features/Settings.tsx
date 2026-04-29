import { useState } from "react";
import { ArrowLeft, Bell, Lock, User } from "lucide-react";

const Settings = () => {
  const [settings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    profileVisibility: "public",
    timezone: "UTC-5",
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive updates via email
                </p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => {}}
                />
                <span className="slider"></span>
              </label>
            </div>
            {/* More toggle switches */}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 text-gray-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Security</h3>
          </div>
          {/* Security options */}
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-gray-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Profile</h3>
          </div>
          {/* Profile form */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
