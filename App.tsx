
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import { useTranslation } from 'react-i18next';
import Spotlight from './components/Spotlight';
import ApiKeyPrompt from './components/ApiKeyPrompt';

const API_KEY_SESSION_STORAGE_KEY = 'gemini-api-key';

const App: React.FC = () => {
  const [csvData, setCsvData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem(API_KEY_SESSION_STORAGE_KEY));
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);

  const handleDataLoaded = (data: string, name: string) => {
    setCsvData(data);
    setFileName(name);
  };

  const handleReset = () => {
    setCsvData('');
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
        {csvData.length === 0 ? (
          <FileUpload onDataLoaded={handleDataLoaded} />
        ) : (
          <AnalysisDashboard
            csvData={csvData}
            fileName={fileName}
            onReset={handleReset}
            apiKey={apiKey}
            onAuthError={(errorMessage) => {
                handleClearKey();
                setApiKeyError(errorMessage);
            }}
            currentLanguage={i18n.language} // Pass the current i18n language
          />
        )}
      </main>
    </div>
  );
};

export default App;