
import React, { useState } from 'react';
import { Page } from '../types';
import { Leaf, Menu, X, User, Globe, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Language, getTranslation } from '../translations';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user?: any;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, user, language, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = getTranslation(language).nav;

  const navItems = [
    { name: t.home, page: Page.Home },
    { name: t.diagnose, page: Page.Diagnose },
    { name: t.market, page: Page.Market },
    { name: t.weather, page: Page.Weather },
    { name: t.simulate, page: Page.Simulation },
    { name: t.finance, page: Page.Finance },
    { name: t.team, page: Page.Team },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate(Page.Home);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate(Page.Home)}>
            <div className="bg-emerald-600 p-1.5 rounded-lg mr-2">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-900 tracking-tight">AgriAgent</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center bg-slate-50 p-1 rounded-xl mr-4 border border-slate-100">
              {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    language === lang ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-xs lg:text-sm font-medium transition-colors hover:text-emerald-600 whitespace-nowrap ${
                  currentPage === item.page ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {item.name}
              </button>
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate(Page.Login)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-medium hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
              >
                <User className="h-4 w-4" />
                {t.login}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={() => onLanguageChange(language === 'en' ? 'mr' : (language === 'mr' ? 'hi' : 'en'))} className="text-slate-400">
              <Globe className="h-5 w-5" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.page ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
