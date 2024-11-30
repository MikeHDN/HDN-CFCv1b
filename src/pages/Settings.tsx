import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Moon, Users, FileText } from 'lucide-react';
import SettingsSection from '../components/Settings/SettingsSection';
import ThemeSelector from '../components/Settings/ThemeSelector';
import NotificationSettings from '../components/Settings/NotificationSettings';
import SecuritySettings from '../components/Settings/SecuritySettings';
import DataManagement from '../components/Settings/DataManagement';
import UserManagement from '../components/Settings/UserManagement';
import LegalDocuments from '../components/Settings/LegalDocuments';

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <SettingsSection
          title="Legal Documents"
          icon={FileText}
          description="Review and accept legal agreements"
        >
          <LegalDocuments />
        </SettingsSection>

        <SettingsSection
          title="User Management"
          icon={Users}
          description="Add, edit, and manage user accounts"
        >
          <UserManagement />
        </SettingsSection>

        <SettingsSection
          title="Data Management"
          icon={Database}
          description="Configure data sources and upload required files"
        >
          <DataManagement />
        </SettingsSection>

        <SettingsSection
          title="Security"
          icon={Shield}
          description="Manage security settings and authentication options"
        >
          <SecuritySettings />
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          icon={Bell}
          description="Configure alert preferences and notification settings"
        >
          <NotificationSettings />
        </SettingsSection>

        <SettingsSection
          title="Appearance"
          icon={Moon}
          description="Customize the look and feel of the platform"
        >
          <ThemeSelector />
        </SettingsSection>
      </div>
    </div>
  );
}