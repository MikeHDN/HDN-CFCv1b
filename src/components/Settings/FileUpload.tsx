import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType, CheckCircle2, AlertCircle } from 'lucide-react';
import { storeFile, getStoredFiles } from '../../services/fileStorage';

export default function FileUpload() {
  const [files, setFiles] = useState<{geolite?: string; highrisk?: string}>({});
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], type: 'geolite' | 'highrisk') => {
    try {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        await storeFile(type, file);
        const storedFiles = await getStoredFiles();
        setFiles(storedFiles);
        setError(null);
      }
    } catch (err) {
      setError('Failed to upload file');
      console.error(err);
    }
  }, []);

  const { getRootProps: getGeoliteProps, getInputProps: getGeoliteInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, 'geolite'),
    accept: {
      'application/octet-stream': ['.mmdb']
    },
    maxFiles: 1
  });

  const { getRootProps: getHighriskProps, getInputProps: getHighriskInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, 'highrisk'),
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">GeoLite2 Database</h3>
          <div
            {...getGeoliteProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          >
            <input {...getGeoliteInputProps()} />
            {files.geolite ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                <p className="text-sm text-gray-400">{files.geolite}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-blue-500 mb-4" />
                <p className="text-sm text-gray-400">
                  Drop GeoLite2-City.mmdb file here
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">High-Risk Data</h3>
          <div
            {...getHighriskProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          >
            <input {...getHighriskInputProps()} />
            {files.highrisk ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                <p className="text-sm text-gray-400">{files.highrisk}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileType className="w-12 h-12 text-blue-500 mb-4" />
                <p className="text-sm text-gray-400">
                  Drop highrisk_with_cves.csv file here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}