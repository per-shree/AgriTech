
import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { Sprout, Microscope, BarChart3, CloudSun, ArrowRight, ShieldCheck, Zap, Globe, MapPin, Lightbulb, Loader2 } from 'lucide-react';
import { Language, getTranslation } from '../translations';
import { GoogleGenAI } from "@google/genai";

interface HomePageProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, language }) => {
  const t = getTranslation(language).homePage;
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return;
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Provide a single, powerful, one-sentence agricultural tip for a farmer in Maharashtra, India. Language: ${language === 'mr' ? 'Marathi' : (language === 'hi' ? 'Hindi' : 'English')}. Focus on sustainability or yield. No markdown.`,
        });
        setInsight(response.text || '');
      } catch (error) {
        console.error('Insight Error:', error);
      } finally {
        setLoadingInsight(false);
      }
    };
    fetchInsight();
  }, [language]);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Smart Insight Bar */}
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="bg-emerald-900/5 backdrop-blur-sm border border-emerald-100 rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-emerald-600 p-2 rounded-xl text-white shrink-0">
                <Lightbulb size={20} />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Smart Agri-Insight</p>
                {loadingInsight ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-emerald-600" />
                    <div className="h-4 w-48 bg-emerald-100 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 font-medium leading-tight">
                    {insight || "Optimize your crop yield with AI-driven precision farming techniques tailored for Maharashtra's soil."}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                {t.heroTag}
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                {t.heroTitle.split('–')[0]} – <span className="text-emerald-600">{t.heroTitle.split('–')[1]}</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                {t.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onNavigate(Page.Diagnose)}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center"
                >
                  {t.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button 
                  onClick={() => onNavigate(Page.Team)}
                  className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:border-emerald-200 hover:text-emerald-600 transition-all flex items-center justify-center"
                >
                  {t.viewSolution}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1000" 
                  alt="Modern Farming in India" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-transparent"></div>
              </div>
              {/* Floating stats box */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden sm:block border border-emerald-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{t.impactLabel}</p>
                    <p className="text-2xl font-bold text-slate-900">Pune, MH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-50 rounded-full blur-3xl -z-10 opacity-50"></div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white border-y border-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.aboutTitle}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t.aboutDesc}
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 transition-transform hover:-translate-y-2">
            <ShieldCheck className="h-12 w-12 text-emerald-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">{t.aiDecisions}</h3>
            <p className="text-slate-600">Advanced machine learning models analyze regional variables like Pune's specific microclimates.</p>
          </div>
          <div className="p-8 rounded-3xl bg-teal-50 border border-teal-100 transition-transform hover:-translate-y-2">
            <Sprout className="h-12 w-12 text-teal-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">{t.sustainableOutcomes}</h3>
            <p className="text-slate-600">Optimize water usage in drought-prone areas through precise irrigation intelligence.</p>
          </div>
          <div className="p-8 rounded-3xl bg-amber-50 border border-amber-100 transition-transform hover:-translate-y-2">
            <Globe className="h-12 w-12 text-amber-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">{t.mandiIntegration}</h3>
            <p className="text-slate-600">Directly connected to local APMC Mandis for real-time pricing and demand updates.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-emerald-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t.ctaTitle}</h2>
          <p className="text-emerald-50 text-xl mb-10 max-w-2xl mx-auto">
            {t.ctaSubtitle}
          </p>
          <button 
            onClick={() => onNavigate(Page.Login)}
            className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold text-xl hover:bg-emerald-50 transition-all shadow-2xl"
          >
            {t.ctaButton}
          </button>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-50 -ml-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl opacity-50 -mr-32 -mb-32"></div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 mb-6 transition-all">
      {icon}
    </div>
    <h4 className="text-xl font-bold mb-3 text-slate-900">{title}</h4>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;
