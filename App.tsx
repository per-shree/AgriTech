
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DiagnosePage from './pages/DiagnosePage';
import MarketPage from './pages/MarketPage';
import WeatherPage from './pages/WeatherPage';
import TeamPage from './pages/TeamPage';
import LoginPage from './pages/LoginPage';
import SustainabilityPage from './pages/SustainabilityPage';
import SimulationPage from './pages/SimulationPage';
import FinancePage from './pages/FinancePage';
import AcademyPage from './pages/AcademyPage';
import SchemesPage from './pages/SchemesPage';
import StorePage from './pages/StorePage';
import ChatBot from './components/ChatBot';
import AgriVaani from './components/AgriVaani';
import { supabase } from './lib/supabase';
import { Language } from './translations';

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
      case Page.Team:
        return <TeamPage language={language} />;
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
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
      <ChatBot />
      <AgriVaani language={language} />
    </div>
  );
};

export default App;
