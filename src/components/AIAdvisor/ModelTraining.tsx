import React, { useState } from 'react';
import { Brain, AlertTriangle, BarChart } from 'lucide-react';
import { trainModel } from '../../services/aiService';
import type { ModelMetrics } from '../../types/ai';

export default function ModelTraining() {
  const [training, setTraining] = useState(false);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrainModel = async () => {
    try {
      setTraining(true);
      setError(null);
      const results = await trainModel();
      setMetrics(results);
    } catch (err) {
      setError('Failed to train model. Please ensure data files are present in the data directory.');
      console.error(err);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold">Train Random Forest Model</h3>
            <p className="text-sm text-gray-400">
              Train a model using local threat intelligence data for breach prediction
            </p>
          </div>
        </div>
        <button
          onClick={handleTrainModel}
          disabled={training}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {training ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Training...</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>Train Model</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {metrics && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Accuracy</p>
              <p className="text-2xl font-semibold">
                {(metrics.accuracy * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Precision</p>
              <p className="text-2xl font-semibold">
                {(metrics.precision * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Recall</p>
              <p className="text-2xl font-semibold">
                {(metrics.recall * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">F1 Score</p>
              <p className="text-2xl font-semibold">
                {(metrics.f1Score * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Feature Importance</h4>
            <div className="space-y-2">
              {metrics.featureImportance.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{feature.name}</span>
                      <span className="text-sm text-gray-400">
                        {(feature.importance * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2"
                        style={{ width: `${feature.importance * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}