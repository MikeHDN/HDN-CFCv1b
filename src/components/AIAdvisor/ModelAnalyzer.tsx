import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType, AlertCircle, CheckCircle2 } from 'lucide-react';
import { analyzeModel } from '../../services/aiService';

interface AnalysisResult {
  modelType: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  issues: string[];
}

export default function ModelAnalyzer() {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileType: 'model' | 'dataset') => {
    if (acceptedFiles.length > 0) {
      if (fileType === 'model') {
        setModelFile(acceptedFiles[0]);
      } else {
        setDatasetFile(acceptedFiles[0]);
      }
    }
  }, []);

  const { getRootProps: getModelRootProps, getInputProps: getModelInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, 'model'),
    accept: {
      'application/x-python': ['.py'],
      'text/x-python': ['.py']
    },
    maxFiles: 1
  });

  const { getRootProps: getDatasetRootProps, getInputProps: getDatasetInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, 'dataset'),
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!modelFile || !datasetFile) {
      setError('Please upload both model and dataset files');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('model', modelFile);
      formData.append('dataset', datasetFile);

      const result = await analyzeModel(formData);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze model');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Model</h3>
          <div
            {...getModelRootProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          >
            <input {...getModelInputProps()} />
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-sm text-gray-400">
              {modelFile ? modelFile.name : 'Drop your Python model file here'}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Dataset</h3>
          <div
            {...getDatasetRootProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          >
            <input {...getDatasetInputProps()} />
            <FileType className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-sm text-gray-400">
              {datasetFile ? datasetFile.name : 'Drop your dataset file here (.csv, .json, .xlsx)'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={loading || !modelFile || !datasetFile}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze Model'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400">Model Type</p>
              <p className="text-lg font-semibold">{analysis.modelType}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400">Accuracy</p>
              <p className="text-lg font-semibold">{(analysis.accuracy * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400">Precision</p>
              <p className="text-lg font-semibold">{(analysis.precision * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400">F1 Score</p>
              <p className="text-lg font-semibold">{(analysis.f1Score * 100).toFixed(1)}%</p>
            </div>
          </div>

          {analysis.issues.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Potential Issues</h4>
              <ul className="space-y-2">
                {analysis.issues.map((issue, index) => (
                  <li key={index} className="flex items-start space-x-2 text-yellow-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}