import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import ThreatIntel from './pages/ThreatIntel';
import ThreatMap from './pages/ThreatMap';
import AIAdvisor from './pages/AIAdvisor';
import VulnerabilityManagement from './pages/VulnerabilityManagement';
import BreachedAccounts from './pages/BreachedAccounts';
import NeonDefense from './pages/NeonDefense';
import Documentation from './pages/Documentation';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="threat-intel" element={<ThreatIntel />} />
          <Route path="threat-map" element={<ThreatMap />} />
          <Route path="ai-advisor" element={<AIAdvisor />} />
          <Route path="vulnerability-management" element={<VulnerabilityManagement />} />
          <Route path="breached-accounts" element={<BreachedAccounts />} />
          <Route path="neon-defense" element={<NeonDefense />} />
          <Route path="docs" element={<Documentation />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;