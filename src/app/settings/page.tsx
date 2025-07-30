"use client";

import { useState } from "react";
import {
  BellIcon,
  UserIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  KeyIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    weeklyReport: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "auto";
    language: string;
    timezone: string;
  };
  privacy: {
    profileVisibility: "public" | "private";
    activityStatus: boolean;
    dataCollection: boolean;
  };
  account: {
    twoFactor: boolean;
    loginAlerts: boolean;
  };
}

export default function Page() {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: true,
      desktop: false,
      weeklyReport: true,
    },
    appearance: {
      theme: "light",
      language: "en",
      timezone: "America/New_York",
    },
    privacy: {
      profileVisibility: "public",
      activityStatus: true,
      dataCollection: false,
    },
    account: {
      twoFactor: false,
      loginAlerts: true,
    },
  });

  const [activeTab, setActiveTab] = useState("notifications");

  const updateSetting = (
    category: keyof Settings,
    key: string,
    value: boolean | string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "appearance", name: "Appearance", icon: PaintBrushIcon },
    { id: "privacy", name: "Privacy", icon: ShieldCheckIcon },
    { id: "account", name: "Account", icon: UserIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-1/4 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="md:w-3/4 p-6">
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          Show Activity Status
                        </div>
                        <div className="text-sm text-gray-600">
                          Let others see when you&apos;re active
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.activityStatus}
                        onChange={(e) =>
                          updateSetting(
                            "privacy",
                            "activityStatus",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          Data Collection
                        </div>
                        <div className="text-sm text-gray-600">
                          Allow collection of usage data for improvements
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.dataCollection}
                        onChange={(e) =>
                          updateSetting(
                            "privacy",
                            "dataCollection",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Account Security
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <KeyIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            Two-Factor Authentication
                          </div>
                          <div className="text-sm text-gray-600">
                            Add an extra layer of security
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.account.twoFactor}
                        onChange={(e) =>
                          updateSetting(
                            "account",
                            "twoFactor",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            Login Alerts
                          </div>
                          <div className="text-sm text-gray-600">
                            Get notified of new login attempts
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.account.loginAlerts}
                        onChange={(e) =>
                          updateSetting(
                            "account",
                            "loginAlerts",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Password & Authentication
                  </h3>
                  <div className="space-y-4">
                    <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Change Password
                    </button>
                    <button className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors ml-0 sm:ml-4">
                      Download Account Data
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">
                    Danger Zone
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <TrashIcon className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">
                        Delete Account
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-end space-x-4">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Reset to Defaults
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
