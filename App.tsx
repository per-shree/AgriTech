
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Page } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ChatBot from './components/ChatBot';
import AgriVaani from './components/AgriVaani';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Language } from './translations';
import { Analytics } from '@vercel/analytics/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';

const DiagnosePage = lazy(() => import('./pages/DiagnosePage'));
const MarketPage = lazy(() => import('./pages/MarketPage'));
const WeatherPage = lazy(() => import('./pages/WeatherPage'));
const SustainabilityPage = lazy(() => import('./pages/SustainabilityPage'));
const SimulationPage = lazy(() => import('./pages/SimulationPage'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const AcademyPage = lazy(() => import('./pages/AcademyPage'));
const SchemesPage = lazy(() => import('./pages/SchemesPage'));
const StorePage = lazy(() => import('./pages/StorePage'));

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [language, setLanguage] = useState<Language>('en');
  const [session, setSession] = useState<any>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user ? { user } : null);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const renderPage = () => {
    const props = { language, showNotification };
    switch (currentPage) {
      case Page.Home:
        return <HomePage onNavigate={setCurrentPage} {...props} />;
      case Page.Diagnose:
        return <DiagnosePage {...props} />;
      case Page.Market:
        return <MarketPage {...props} />;
      case Page.Weather:
        return <WeatherPage />;
      case Page.Sustainability:
        return <SustainabilityPage {...props} />;
      case Page.Simulation:
        return <SimulationPage {...props} />;
      case Page.Finance:
        return <FinancePage user={session?.user} onNavigate={setCurrentPage} {...props} />;
      case Page.Academy:
        return <AcademyPage {...props} />;
      case Page.Schemes:
        return <SchemesPage {...props} />;
      case Page.Store:
        return <StorePage {...props} />;
      case Page.Login:
        return <LoginPage onLogin={() => setCurrentPage(Page.Home)} {...props} />;
      default:
        return <HomePage onNavigate={setCurrentPage} {...props} />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {appLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-emerald-600 p-6 rounded-[2rem] shadow-2xl shadow-emerald-200 mb-8"
            >
              <Leaf className="h-16 w-16 text-white" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-black text-emerald-900 tracking-tighter"
            >
              AgriAgent
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 mt-1"
            >
              Powered by Qwicit
            </motion.p>
            <div className="mt-6 flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 bg-emerald-600 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4"
          >
            <div className={`
              flex items-center gap-4 p-5 rounded-[1.5rem] shadow-2xl border backdrop-blur-md
              ${notification.type === 'success' ? 'bg-emerald-900/90 border-emerald-400/30 text-emerald-50' : 
                notification.type === 'error' ? 'bg-red-900/90 border-red-400/30 text-red-50' : 
                'bg-slate-900/90 border-slate-400/30 text-slate-50'}
            `}>
              <div className={`p-2 rounded-xl ${
                notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                notification.type === 'error' ? 'bg-red-500/20 text-red-400' : 
                'bg-blue-500/20 text-blue-400'
              }`}>
                {notification.type === 'success' ? <CheckCircle2 className="h-6 w-6" /> : 
                 notification.type === 'error' ? <AlertCircle className="h-6 w-6" /> : 
                 <Leaf className="h-6 w-6" />}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold leading-tight">{notification.message}</p>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 opacity-50" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen">
        <Navbar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
          user={session?.user} 
          language={language}
          onLanguageChange={setLanguage}
        />
        <main className="flex-grow pt-16">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            {renderPage()}
          </Suspense>
        </main>
        <Footer onNavigate={setCurrentPage} />
        <ChatBot />
        <AgriVaani language={language} />
        <Analytics />
      </div>
    </>
  );
};

export default App;
