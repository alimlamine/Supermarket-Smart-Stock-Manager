
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import { useTranslation } from 'react-i18next';
import Spotlight from './components/Spotlight';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import type { DataObject } from './types';

const API_KEY_SESSION_STORAGE_KEY = 'gemini-api-key';

// Robust CSV parser to handle values with commas inside quotes
const parseCSV = (text: string): { headers: string[], data: DataObject[] } => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], data: [] };

  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = lines.slice(1).map((line) => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
    const row: DataObject = {};
    headers.forEach((header, i) => {
      // Try to convert to number if it looks like one, otherwise keep as string
      const value = values[i];
      row[header] = !isNaN(Number(value)) && value.trim() !== '' ? Number(value) : value;
    });
    return row;
  });

  return { headers, data };
};


const App: React.FC = () => {
  const [parsedData, setParsedData] = useState<{ headers: string[], data: DataObject[] } | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem(API_KEY_SESSION_STORAGE_KEY));
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);

  const handleDataLoaded = (data: string, name: string) => {
    const { headers, data: parsed } = parseCSV(data);
    setParsedData({ headers, data: parsed });
    setFileName(name);
  };

  const handleReset = () => {
    setParsedData(null);
    setFileName('');
  };

  const handleKeySubmit = (key: string) => {
    sessionStorage.setItem(API_KEY_SESSION_STORAGE_KEY, key);
    setApiKey(key);
    setApiKeyError(null); // Clear previous errors
  };

  const handleClearKey = () => {
    sessionStorage.removeItem(API_KEY_SESSION_STORAGE_KEY);
    setApiKey(null);
  };

  if (!apiKey) {
    return <ApiKeyPrompt error={apiKeyError} onKeySubmit={handleKeySubmit} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans relative isolate">
      <div className="pointer-events-none absolute -top-40 -left-10 md:-left-32 md:-top-20" aria-hidden="true">
        <Spotlight
          fill="rgba(139, 92, 246, 0.4)"
        />
      </div>
      <div className="pointer-events-none absolute top-10 left-full -translate-x-1/2" aria-hidden="true">
        <Spotlight
          fill="rgba(55, 48, 163, 0.3)"
        />
      </div>
      <Header onClearKey={handleClearKey} />
      <main className="container mx-auto p-4 md:p-8">
        {!parsedData ? (
          <FileUpload onDataLoaded={handleDataLoaded} />
        ) : (
          <AnalysisDashboard
            initialData={parsedData.data}
            headers={parsedData.headers}
            fileName={fileName}
            onReset={handleReset}
            apiKey={apiKey}
            onAuthError={(errorMessage) => {
                handleClearKey();
                setApiKeyError(errorMessage);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default App;