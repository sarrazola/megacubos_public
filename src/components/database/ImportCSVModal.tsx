import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

interface ImportCSVModalProps {
  onClose: () => void;
  tableName: string;
  onImport: (mappedData: any[]) => Promise<void>;
  tableColumns: string[];
}

interface FieldMapping {
  csvField: string;
  dbField: string;
}

const ImportCSVModal: React.FC<ImportCSVModalProps> = ({
  onClose,
  tableName,
  onImport,
  tableColumns,
}) => {
  const [csvData, setCSVData] = useState<any[]>([]);
  const [csvColumns, setCSVColumns] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [hasHeaders, setHasHeaders] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as any[];
        if (data.length > 0) {
          const headers = hasHeaders ? data[0] : Object.keys(data[0]).map((_, i) => `Column ${i + 1}`);
          setCSVColumns(headers);
          setCSVData(hasHeaders ? data.slice(1) : data);
          setFieldMappings(
            headers.map(header => ({
              csvField: header,
              dbField: ''
            }))
          );
        }
      },
      header: false
    });
  };

  const handleMapping = (csvField: string, dbField: string) => {
    setFieldMappings(prev => 
      prev.map(mapping => 
        mapping.csvField === csvField 
          ? { ...mapping, dbField } 
          : mapping
      )
    );
  };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      const mappedData = csvData.map(row => {
        const newRow: any = {};
        fieldMappings.forEach(mapping => {
          if (mapping.dbField) {
            const csvIndex = csvColumns.indexOf(mapping.csvField);
            newRow[mapping.dbField] = row[csvIndex] || null;
          }
        });
        return newRow;
      });

      await onImport(mappedData);
      onClose();
    } catch (error: any) {
      console.error('Error importing data:', {
        error,
        details: error.details,
        message: error.message,
        hint: error.hint
      });
      
      let errorMessage = 'Failed to import data: ';
      if (error.details) {
        errorMessage += error.details;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Import CSV - {tableName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">Upload CSV File</h3>
                <p className="text-sm text-gray-500">
                  Select a CSV file to import data into the table
                </p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="hasHeaders"
                checked={hasHeaders}
                onChange={(e) => setHasHeaders(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="hasHeaders" className="text-sm text-gray-700">
                Treat first row as headers
              </label>
            </div>
          </div>

          {csvColumns.length > 0 && (
            <>
              <h3 className="text-lg font-medium mb-4">Schema mapping</h3>
              <div className="space-y-4">
                {fieldMappings.map((mapping, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CSV Column
                      </label>
                      <input
                        type="text"
                        value={mapping.csvField}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Database Field
                      </label>
                      <select
                        value={mapping.dbField}
                        onChange={(e) => handleMapping(mapping.csvField, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">Choose a field</option>
                        {tableColumns.map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-4 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={isLoading || !csvData.length}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Importing...' : 'Import CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportCSVModal; 