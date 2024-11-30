import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  icon: LucideIcon;
  description: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  icon: Icon,
  description,
  children
}: SettingsSectionProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-6 h-6 text-blue-500" />
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}