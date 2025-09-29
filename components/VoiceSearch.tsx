import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
}

const mapI18nToSpeechLang = (i18nLang: string): string => {
  const base = i18nLang.toLowerCase();
  if (base.startsWith('fr')) return 'fr-FR';
  if (base.startsWith('ar')) return 'ar-EG'; // default Arabic locale
  return 'en-US';
};

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const hasWebkit = 'webkitSpeechRecognition' in window;
    const hasStandard = 'SpeechRecognition' in window as any;
    if (!hasWebkit && !hasStandard) {
      console.warn("Web Speech API is not supported by this browser.");
      setIsSupported(false);
      return;
    }
    console.log('Initializing SpeechRecognition');
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = mapI18nToSpeechLang(i18n.language);

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      console.log('Speech recognition result', event);
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      onTranscript(speechResult);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        console.log('Speech recognition stopped on cleanup');
      }
    };
  }, [i18n.language, onTranscript]);

  useEffect(() => {
    // Update recognition language on language change if already initialized
    if (recognitionRef.current) {
      recognitionRef.current.lang = mapI18nToSpeechLang(i18n.language);
    }
  }, [i18n.language]);

  const startListening = () => {
    console.log('Attempting to start listening');
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.lang = mapI18nToSpeechLang(i18n.language);
      recognitionRef.current.start();
      setIsListening(true);
      console.log('Started listening');
    }
  };

  const stopListening = () => {
    console.log('Attempting to stop listening');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      console.log('Stopped listening');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={isListening ? stopListening : startListening} className={`p-2 rounded-full transition-all transform shadow-lg ${isListening ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30 hover:shadow-red-600/50' : 'bg-primary hover:bg-violet-500 shadow-primary/30 hover:shadow-primary/50'} text-white disabled:bg-secondary disabled:cursor-not-allowed`} disabled={!isSupported}>
        {isListening ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        )}
      </button>
      {!isSupported && <p className="text-red-500 text-sm">Voice search not supported</p>}
      {transcript && <p className="text-text-secondary text-sm">{transcript}</p>}
    </div>
  );
};

export default VoiceSearch;
