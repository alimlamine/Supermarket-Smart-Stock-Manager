import React, { useState } from 'react';

interface ApiKeyPromptProps {
  error: string | null;
  onKeySubmit: (key: string) => void;
}

const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18.27-1.42 1.42a2 2 0 0 1-2.83 0L12 14l-1.42 1.42a2 2 0 0 1-2.83 0L2.27 9.96a2 2 0 0 1 0-2.83l1.42-1.42a2 2 0 0 1 2.83 0L12 11l1.42-1.42a2 2 0 0 1 2.83 0l5.48 5.48a2 2 0 0 1 0 2.83Z"/><circle cx="15" cy="9" r="2"/></svg>
);
const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const BillingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);
const ApiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20V16"/></svg>
);


const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ error, onKeySubmit }) => {
  const [localKey, setLocalKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localKey.trim()) {
      onKeySubmit(localKey.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg p-8 border border-secondary/30 rounded-2xl bg-surface/50 backdrop-blur-xl shadow-2xl shadow-primary/10">
            <div className="text-center">
                <div className="flex items-center justify-center p-4 bg-primary/10 rounded-full border border-primary/30 mb-4 w-24 h-24 mx-auto">
                    <KeyIcon className="h-12 w-12 text-primary"/>
                </div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">Enter Your API Key</h1>
                <p className="text-text-secondary mb-6">
                    To analyze your data, the app needs a valid Gemini API key. Please provide it below to continue.
                </p>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm rounded-lg p-4 mb-4 text-left">
                    <p className="font-semibold mb-2">Authentication Failed</p>
                    <p className="whitespace-pre-wrap">{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="password"
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    placeholder="Paste your API key here"
                    className="bg-background/70 border border-secondary rounded-lg py-3 px-5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary w-full"
                    aria-label="API Key Input"
                />
                <button 
                    type="submit" 
                    disabled={!localKey.trim()}
                    className="px-8 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 bg-primary hover:bg-violet-500 cursor-pointer shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:bg-secondary disabled:cursor-not-allowed disabled:scale-100"
                >
                    Save and Continue
                </button>
            </form>

            <div className="mt-8 text-left text-sm text-text-secondary border-t border-secondary/50 pt-6">
                <h4 className="font-bold mb-4 text-text-primary">Setup Checklist</h4>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="p-1 bg-primary/20 rounded-full mt-1"><CheckIcon className="h-4 w-4 text-primary"/></div>
                        <div>
                            <strong>Get an API Key:</strong>
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                                Create a new key in AI Studio &rarr;
                            </a>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                         <div className="p-1 bg-primary/20 rounded-full mt-1"><BillingIcon className="h-4 w-4 text-primary"/></div>
                        <div>
                            <strong>Enable Billing:</strong> Your Google Cloud project must have billing enabled.
                            <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                                Check your billing account &rarr;
                            </a>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="p-1 bg-primary/20 rounded-full mt-1"><ApiIcon className="h-4 w-4 text-primary"/></div>
                        <div>
                            <strong>Enable the API:</strong> The <strong>"Generative Language API"</strong> must be enabled for your project.
                            <a href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com" target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                                Enable the API here &rarr;
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
             <p className="text-xs text-text-secondary mt-6 text-center">
                Your key is stored only in your browser for this session.
            </p>
        </div>
    </div>
  );
};

export default ApiKeyPrompt;