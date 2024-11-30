import React from 'react';
import ModelAnalyzer from '../components/AIAdvisor/ModelAnalyzer';
import ModelTraining from '../components/AIAdvisor/ModelTraining';

export default function AIAdvisor() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-8 bg-[#020617] p-8 rounded-lg">
        <h1 className="text-4xl font-bold text-[#3B82F6] mb-2">AI ADVISOR</h1>
        <p className="text-gray-400 text-lg">AI Advisory Powered by Hakdefnet</p>
      </div>
      
      <ModelTraining />
      <ModelAnalyzer />
    </div>
  );
}