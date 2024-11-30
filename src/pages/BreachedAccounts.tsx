import React from 'react';
import BreachedAccountsComponent from '../components/Dashboard/BreachedAccounts';

export default function BreachedAccounts() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Breached Accounts</h1>
      <BreachedAccountsComponent />
    </div>
  );
}