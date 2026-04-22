
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
    switch (currentPage) {
      case Page.Home:
        return <HomePage onNavigate={setCurrentPage} language={language} />;
      case Page.Diagnose:
        return <DiagnosePage language={language} />;
      case Page.Market:
        return <MarketPage />;
      case Page.Weather:
        return <WeatherPage />;
      case Page.Sustainability:
        return <SustainabilityPage language={language} />;
      case Page.Simulation:
        return <SimulationPage language={language} />;
      case Page.Finance:
        return <FinancePage language={language} user={session?.user} onNavigate={setCurrentPage} />;
      case Page.Academy:
        return <AcademyPage language={language} />;
      case Page.Schemes:
        return <SchemesPage language={language} />;
      case Page.Store:
        return <StorePage language={language} />;
      case Page.Login:
        return <LoginPage onLogin={() => setCurrentPage(Page.Home)} language={language} />;
      default:
        return <HomePage onNavigate={setCurrentPage} language={language} />;
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
