import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Menu, X } from 'lucide-react';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-slate-900 text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-indigo-400 mr-2" />
            <span className="font-bold text-xl">{t('nav.title')}</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                {t('nav.dashboard')}
              </NavLink>
              <NavLink
                to="/intake"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                {t('nav.intake')}
              </NavLink>
              <LanguageToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              {t('nav.dashboard')}
            </NavLink>
            <NavLink
              to="/intake"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              {t('nav.intake')}
            </NavLink>
            <div className="px-3 py-2">
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
