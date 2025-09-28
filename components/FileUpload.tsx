import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface FileUploadProps {
  onDataLoaded: (csvData: string, fileName: string) => void;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);


const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { t } = useTranslation();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsParsing(true);
    try {
      const text = await file.text();
      if (!text.trim() || !text.includes(',')) {
          throw new Error(t('fileUpload.error'));
      }
      onDataLoaded(text, file.name);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    } finally {
      setIsParsing(false);
      event.target.value = '';
    }
  }, [onDataLoaded, t]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-secondary/30 rounded-2xl bg-surface/50 backdrop-blur-xl mt-8 shadow-2xl shadow-primary/10">
        <div className="flex items-center justify-center p-4 bg-primary/10 rounded-full border border-primary/30 mb-4">
            <UploadIcon className="h-20 w-20 text-primary"/>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-text-primary">{t('fileUpload.title')}</h2>
        <p className="text-text-secondary mb-6 max-w-md">
            {t('fileUpload.description')}
        </p>
        <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isParsing}
        />
        <label
            htmlFor="file-upload"
            className={`px-8 py-3 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${isParsing ? 'bg-secondary cursor-not-allowed' : 'bg-primary hover:bg-violet-500 cursor-pointer shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'}`}
        >
            {isParsing ? t('fileUpload.processing') : t('fileUpload.browse')}
        </label>
        {error && <p className="text-red-400 mt-4">{error}</p>}
        <div className="mt-8 text-left rtl:text-right text-sm text-text-secondary bg-background/50 p-4 rounded-lg w-full max-w-2xl">
            <h4 className="font-bold mb-2 text-text-primary">{t('fileUpload.exampleTitle')}</h4>
            <pre className="text-xs whitespace-pre-wrap" dir="ltr"><code>
                {t('fileUpload.exampleContent')}
            </code></pre>
        </div>
    </div>
  );
};

export default FileUpload;