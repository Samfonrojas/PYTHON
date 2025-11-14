
import React from 'react';
import { useTranslation, Language } from '../i18n';
import { SparklesIcon, LanguageIcon } from './Icons';

interface TopNavProps {
  onToggleChat: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ onToggleChat }) => {
  const { t, language, setLanguage } = useTranslation();

  return (
    <header className="bg-bunker-900/80 backdrop-blur-sm p-3 border-b border-bunker-800 flex items-center justify-between z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
            <img src="https://www.python.org/static/favicon.ico" alt="Python logo" className="w-7 h-7"/>
            <span className="font-bold text-lg text-white">C</span>
            <span className="font-bold text-lg text-bunker-400 -ml-1.5">_</span>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-bunker-200 hover:text-white transition-colors">{t('nav.myHome')}</a>
          <a href="#" className="text-sm font-medium text-bunker-200 hover:text-white transition-colors">{t('nav.syllabus')}</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleChat}
          className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <SparklesIcon className="w-5 h-5" />
          {t('nav.aiAssistant')}
        </button>
        <div className="w-px h-6 bg-bunker-700"></div>
        <button className="text-sm font-medium text-bunker-200 hover:text-white transition-colors hidden sm:block">{t('nav.tools')}</button>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-bunker-800 border border-bunker-700 rounded-md pl-3 pr-8 py-1.5 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none appearance-none"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-bunker-400">
            <LanguageIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
