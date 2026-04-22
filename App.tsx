
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Page } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ChatBot from './components/ChatBot';
import AgriVaani from './components/AgriVaani';
import { supabase } from './lib/supabase';
import { Language } from './translations';
import { Analytics } from '@vercel/analytics/react';

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
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
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
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
  );
};

export default App;
