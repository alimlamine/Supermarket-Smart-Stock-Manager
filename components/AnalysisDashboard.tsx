
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Visualization } from '../types';
import { analyzeProductData, AuthenticationError } from '../services/geminiService';
import VisualizationRenderer from './VisualizationRenderer';
import Loader from './Loader';
import { useTranslation } from 'react-i18next';
import VoiceSearch from './VoiceSearch';

interface AnalysisDashboardProps {
  csvData: string;
  fileName: string;
  onReset: () => void;
  apiKey: string;
  onAuthError: (message: string) => void;
}

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const { t } = useTranslation();
    const isModel = message.role === 'model';
    return (
        <div className={`flex items-start gap-4 ${!isModel ? 'flex-row-reverse' : ''} `}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isModel ? 'bg-primary text-white' : 'bg-secondary text-text-primary'}`}>
                {isModel ? t('dashboard.ai') : t('dashboard.you')}
            </div>
            <div className={`p-4 rounded-lg max-w-4xl ${isModel ? 'bg-surface/80' : 'bg-primary/80'}`}>
                <p className="text-text-primary whitespace-pre-wrap">{message.content}</p>
                {message.visualization && (
                    <div className="mt-4 bg-background/50 p-4 rounded-md">
                        <VisualizationRenderer visualization={message.visualization} />
                    </div>
                )}
            </div>
        </div>
    );
};


const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ csvData, fileName, onReset, apiKey, onAuthError }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState<string>('');
    const [voiceSearchLanguage, setVoiceSearchLanguage] = useState<string>('en-US');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t, i18n } = useTranslation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        setMessages([
            {
                role: 'model',
                content: t('dashboard.initialGreeting', { fileName })
            }
        ]);
    }, [csvData, fileName, t]);

    useEffect(() => {
      if (voiceTranscript) {
        handleQuerySubmit(null, voiceTranscript);
        setVoiceTranscript(''); // Clear transcript after submission
      }
    }, [voiceTranscript]);

    const handleVoiceTranscript = (transcript: string) => {
      setVoiceTranscript(transcript);
    };

    const handleVoiceLanguageChange = (lang: string) => {
      setVoiceSearchLanguage(lang);
    };

    const handleQuerySubmit = async (e: React.FormEvent | null, transcript: string | null = null) => {
        e?.preventDefault();
        const currentQuery = transcript || query;
        if (!currentQuery.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: currentQuery };
        setMessages(prev => [...prev, userMessage]);
        setQuery('');
        setIsLoading(true);

        try {
            const { explanation, visualization } = await analyzeProductData(csvData, currentQuery, i18n.language, apiKey);
            const modelMessage: ChatMessage = {
                role: 'model',
                content: explanation,
                visualization: visualization || undefined
            };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Failed to get analysis:", error);
            if (error instanceof AuthenticationError) {
                onAuthError(error.message);
            } else {
                const errorMessage: ChatMessage = {
                    role: 'model',
                    content: t('errors.analysisFailed')
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-surface/50 backdrop-blur-xl border border-secondary/30 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="p-4 border-b border-secondary/50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-text-primary">{t('dashboard.chatTitle')}</h2>
                <button onClick={onReset} className="text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                    {t('dashboard.newFile')}
                </button>
            </div>
            
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {messages.map((msg, index) => <ChatBubble key={index} message={msg} />)}
                {isLoading && (
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-primary text-white">{t('dashboard.ai')}</div>
                        <div className="p-4 rounded-lg bg-surface/80 flex items-center space-x-2 rtl:space-x-reverse">
                           <Loader />
                           <p className="text-text-secondary">{t('dashboard.analyzing')}</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-secondary/50 bg-surface/30">
                <form onSubmit={handleQuerySubmit} className="flex items-center gap-4">
                    <VoiceSearch onTranscript={handleVoiceTranscript} onLanguageChange={handleVoiceLanguageChange} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('dashboard.placeholder')}
                        className="flex-1 bg-background/70 border border-secondary rounded-full py-3 px-5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || (!query.trim() && !voiceTranscript)} className="bg-primary text-white p-3 rounded-full disabled:bg-secondary disabled:cursor-not-allowed hover:bg-violet-500 transition-all transform hover:scale-110 shadow-lg shadow-primary/30 hover:shadow-primary/50">
                        <SendIcon className="w-6 h-6"/>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AnalysisDashboard;