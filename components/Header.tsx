import React from 'react';
import { useTranslation } from 'react-i18next';

const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

// FIX: Corrected the malformed `viewBox` attribute in the SVG definition which caused multiple parsing errors.
const LogOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);


const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ];

  return (
    <div className="relative">
      <select
        value={i18n.language.split('-')[0]}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-surface/50 border border-secondary text-text-primary text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2 appearance-none"
        aria-label="Language switcher"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-surface">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

interface HeaderProps {
    onClearKey: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearKey }) => {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-10 bg-surface/70 backdrop-blur-lg border-b border-secondary/50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <ShoppingCartIcon className="h-8 w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            {t('header.title')}
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
                onClick={onClearKey}
                className="p-2 rounded-md hover:bg-surface transition-colors"
                aria-label="Change API Key"
                title="Change API Key"
            >
                <LogOutIcon className="h-5 w-5 text-text-secondary"/>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
