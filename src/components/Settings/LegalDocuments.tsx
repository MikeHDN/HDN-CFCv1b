import React, { useState } from 'react';
import { FileText, Lock, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function LegalDocuments() {
  const { settings, updateSettings } = useStore();
  const [showAgreement, setShowAgreement] = useState(false);

  const handleAcceptAgreement = () => {
    updateSettings({ agreementsAccepted: true });
    setShowAgreement(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-blue-500" />
          <div>
            <span className="font-medium">Legal Agreements</span>
            <p className="text-sm text-gray-400">Review and accept legal documents</p>
          </div>
        </div>
        <button
          onClick={() => setShowAgreement(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Review Documents
        </button>
      </div>

      {showAgreement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Legal Agreements</h3>

            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">Non-Disclosure Agreement</h4>
                </div>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>This Non-Disclosure Agreement ("Agreement") is entered into between:</p>
                  <p>M.Goedeker MSc. & Hakdefnet GmbH ("Company")</p>
                  <p>and</p>
                  <p>The User ("Recipient")</p>
                  <p className="font-medium mt-4">1. Confidential Information</p>
                  <p>All information related to the HDN-CFC Platform, including but not limited to source code, algorithms, threat intelligence data, and system architecture.</p>
                  <p className="font-medium mt-4">2. Non-Disclosure</p>
                  <p>Recipient agrees to maintain the confidentiality of all Confidential Information and not to disclose it to any third party.</p>
                  <p className="font-medium mt-4">3. Term</p>
                  <p>This Agreement shall remain in effect indefinitely from the date of acceptance.</p>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">License Agreement</h4>
                </div>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>© 2024 M.Goedeker MSc. & Hakdefnet GmbH. All rights reserved.</p>
                  <p className="font-medium mt-4">1. License Grant</p>
                  <p>Subject to the terms of this Agreement, Company grants User a non-exclusive, non-transferable license to use the HDN-CFC Platform.</p>
                  <p className="font-medium mt-4">2. Restrictions</p>
                  <p>User shall not modify, reverse engineer, decompile, or create derivative works based on the Platform.</p>
                  <p className="font-medium mt-4">3. Zero Liability</p>
                  <p>THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAgreement(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptAgreement}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Accept Agreements
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {settings.agreementsAccepted && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 flex items-center space-x-3">
          <Shield className="w-5 h-5 text-green-500" />
          <p className="text-green-200">Legal agreements have been accepted</p>
        </div>
      )}
    </div>
  );
}