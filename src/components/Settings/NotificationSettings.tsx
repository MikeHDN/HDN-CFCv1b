import React from 'react';
import { useStore } from '../../store/useStore';

export default function NotificationSettings() {
  const { settings, updateNotificationSettings } = useStore();
  const { notifications } = settings;

  const toggleNotification = (key: keyof typeof notifications) => {
    updateNotificationSettings({ [key]: !notifications[key] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">Critical Alerts</span>
          <p className="text-sm text-gray-400">Get notified about critical security events</p>
        </div>
        <button
          onClick={() => toggleNotification('criticalAlerts')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notifications.criticalAlerts ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notifications.criticalAlerts ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">System Updates</span>
          <p className="text-sm text-gray-400">Notifications about system changes and updates</p>
        </div>
        <button
          onClick={() => toggleNotification('systemUpdates')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notifications.systemUpdates ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notifications.systemUpdates ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">Threat Intelligence</span>
          <p className="text-sm text-gray-400">Updates about new threats and indicators</p>
        </div>
        <button
          onClick={() => toggleNotification('threatIntel')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notifications.threatIntel ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notifications.threatIntel ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">Incident Updates</span>
          <p className="text-sm text-gray-400">Get notified about incident status changes</p>
        </div>
        <button
          onClick={() => toggleNotification('incidents')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notifications.incidents ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notifications.incidents ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}