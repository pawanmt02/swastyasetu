import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          i18n.language === 'en' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('hi')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          i18n.language === 'hi' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white'
        }`}
      >
        हिं
      </button>
      <button
        onClick={() => changeLanguage('kn')}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          i18n.language === 'kn' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white'
        }`}
      >
        ಕನ
      </button>
    </div>
  );
};

export default LanguageToggle;
