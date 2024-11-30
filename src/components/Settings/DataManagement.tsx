import React from 'react';
import { Database } from 'lucide-react';
import SettingsSection from './SettingsSection';
import ThreatIntelSources from './ThreatIntelSources';
import FileUpload from './FileUpload';
import BreachSearchConfig from './BreachSearchConfig';

export default function DataManagement() {
  return (
    <div className="space-y-6">
      <SettingsSection
        title="Required Files"
        icon={Database}
        description="Upload and manage required data files"
      >
        <FileUpload />
      </SettingsSection>

      <SettingsSection
        title="Threat Intelligence"
        icon={Database}
        description="Configure and manage threat intelligence sources"
      >
        <ThreatIntelSources />
      </SettingsSection>

      <SettingsSection
        title="Breach Search"
        icon={Database}
        description="Configure breach search settings"
      >
        <BreachSearchConfig />
      </SettingsSection>
    </div>
  );
}