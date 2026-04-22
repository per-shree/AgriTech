
import React, { useState } from 'react';
import { Page } from '../types';
import { Leaf, Menu, X, User, Globe, LogOut, GraduationCap, Landmark, ShoppingBag } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
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
    { name: t.schemes, page: Page.Schemes },
    { name: t.simulate, page: Page.Simulation },
    { name: t.finance, page: Page.Finance },
    { name: t.academy, page: Page.Academy },
    { name: t.store, page: Page.Store, isComingSoon: true },
  ];

  const handleLogout = async () => {
    await signOut(auth);
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
            <div className="flex flex-col">
              <span className="text-xl font-bold text-emerald-900 tracking-tight leading-none">AgriAgent</span>
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">by Qwicit</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center space-x-2">
            <div className="flex items-center bg-slate-50 p-1 rounded-xl mr-2 border border-slate-100">
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
                className={`text-[11px] font-bold transition-colors hover:text-emerald-600 whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl relative group ${
                  currentPage === item.page ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600'
                }`}
              >
                {item.page === Page.Academy && <GraduationCap className="h-4 w-4" />}
                {item.page === Page.Schemes && <Landmark className="h-3.5 w-3.5" />}
                {item.page === Page.Store && <ShoppingBag className="h-3.5 w-3.5" />}
                {item.name}
                {item.isComingSoon && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-white text-[7px] font-black px-1 py-0.5 rounded shadow-sm group-hover:scale-110 transition-transform">
                    {t.comingSoon}
                  </span>
                )}
              </button>
            ))}

            {user ? (
              <div className="flex items-center gap-3 pl-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200">
                    {user.email?.[0].toUpperCase()}
                  </div>
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
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
              >
                <User className="h-4 w-4" />
                {t.login}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center gap-4">
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
        <div className="xl:hidden bg-white border-b border-emerald-100 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-3 rounded-xl text-base font-bold ${
                  currentPage === item.page ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.page === Page.Academy && <GraduationCap className="h-5 w-5" />}
                    {item.page === Page.Schemes && <Landmark className="h-5 w-5" />}
                    {item.page === Page.Store && <ShoppingBag className="h-5 w-5" />}
                    {item.name}
                  </div>
                  {item.isComingSoon && (
                    <span className="bg-amber-400 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {t.comingSoon}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
