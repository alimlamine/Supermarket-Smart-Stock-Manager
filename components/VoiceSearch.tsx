
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

const mapI18nToSpeechLang = (i18nLang: string): string => {
  const base = i18nLang.toLowerCase();
  if (base.startsWith('fr')) return 'fr-FR';
  if (base.startsWith('ar')) return 'ar-EG'; // default Arabic locale
  return 'en-US';
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: {
    isFinal: boolean;
    [key: number]: {
      transcript: string;
    };
  }[];
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}


const VoiceSearch: React.FC<VoiceSearchProps> = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const hasWebkit = 'webkitSpeechRecognition' in window;
    const hasStandard = 'SpeechRecognition' in window;
    if (!hasWebkit && !hasStandard) {
      console.warn("Web Speech API is not supported by this browser.");
      setIsSupported(false);
      return;
    }
    const SpeechRecognitionImpl = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognitionImpl();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = mapI18nToSpeechLang(i18n.language);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      onTranscript(speechResult);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [i18n.language, onTranscript]);

  useEffect(() => {
    // Update recognition language on language change if already initialized
    if (recognitionRef.current) {
      recognitionRef.current.lang = mapI18nToSpeechLang(i18n.language);
    }
  }, [i18n.language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
        recognitionRef.current.stop();
    } else {
        recognitionRef.current.lang = mapI18nToSpeechLang(i18n.language);
        recognitionRef.current.start();
        setIsListening(true);
    }
  };


  if (!isSupported) {
    return (
      <button 
        type="button"
        className="p-3 rounded-full bg-surface text-text-secondary cursor-not-allowed opacity-50" 
        disabled
        title="Voice search is not supported by your browser."
        aria-label="Voice search not supported"
      >
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="4" y1="4" x2="20" y2="20"/></svg>
      </button>
    );
  }

  return (
    <button 
        type="button"
        onClick={toggleListening} 
        className={`p-3 rounded-full transition-all transform ${isListening ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30' : 'bg-primary hover:bg-violet-500 shadow-lg shadow-primary/30 hover:shadow-primary/50'} text-white disabled:bg-secondary disabled:cursor-not-allowed`} 
        disabled={disabled}
        aria-label={isListening ? 'Stop listening' : 'Start voice search'}
        title={isListening ? 'Stop listening' : 'Start voice search'}
    >
        {isListening ? (
          <svg className="w-6 h-6 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>
        ) : (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        )}
      </button>
  );
};

export default VoiceSearch;
