
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Visualization, DataObject } from '../types';
import { analyzeProductData, AuthenticationError } from '../services/geminiService';
import VisualizationRenderer from './VisualizationRenderer';
import Loader from './Loader';
import StockManager from './StockManager';
import { useTranslation } from 'react-i18next';

interface AnalysisDashboardProps {
  initialData: DataObject[];
  headers: string[];
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

// Helper to convert structured data back to a CSV string for the AI prompt
const dataToCsvString = (headers: string[], data: DataObject[]): string => {
    const headerRow = headers.join(',');
    const dataRows = data.map(row => 
        headers.map(header => {
            const value = row[header];
            // Quote values that contain commas
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
            }
            return value;
        }).join(',')
    );
    return [headerRow, ...dataRows].join('\n');
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ initialData, headers, fileName, onReset, apiKey, onAuthError }) => {
    const [activeTab, setActiveTab] = useState<'manage' | 'analyze'>('manage');
    const [productData, setProductData] = useState<DataObject[]>(initialData);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
    }, [fileName, t]);

    const handleQuerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setQuery('');
        setIsLoading(true);

        try {
            const currentCsvData = dataToCsvString(headers, productData);
            const { explanation, visualization } = await analyzeProductData(currentCsvData, query, i18n.language, apiKey);
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

    const TabButton: React.FC<{ tab: 'manage' | 'analyze', children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-surface/50 backdrop-blur-xl border border-secondary/30 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="p-4 border-b border-secondary/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <TabButton tab="manage">{t('dashboard.tabManage')}</TabButton>
                    <TabButton tab="analyze">{t('dashboard.tabAnalyze')}</TabButton>
                </div>
                <button onClick={onReset} className="text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                    {t('dashboard.newFile')}
                </button>
            </div>
            
            {activeTab === 'manage' && (
                <StockManager 
                    data={productData}
                    headers={headers}
                    onDataChange={setProductData}
                />
            )}

            {activeTab === 'analyze' && (
                <>
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
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('dashboard.placeholder')}
                                className="flex-1 bg-background/70 border border-secondary rounded-full py-3 px-5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !query.trim()} className="bg-primary text-white p-3 rounded-full disabled:bg-secondary disabled:cursor-not-allowed hover:bg-violet-500 transition-all transform hover:scale-110 shadow-lg shadow-primary/30 hover:shadow-primary/50">
                                <SendIcon className="w-6 h-6"/>
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalysisDashboard;