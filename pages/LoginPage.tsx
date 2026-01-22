
import React, { useState } from 'react';
import { Leaf, Mail, Lock, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Language, getTranslation } from '../translations';

interface LoginPageProps {
  onLogin: () => void;
  language: Language;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, language }) => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const t = getTranslation(language).loginPage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Verification email sent! Please check your inbox.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full animate-in zoom-in duration-300">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-emerald-50 text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-200">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isSignUp ? t.joinAgri : t.welcomeBack}
          </h1>
          <p className="text-slate-500 mb-10">
            {isSignUp ? t.startJourney : t.accessDashboard}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center gap-2 text-left">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="name@farm.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center shadow-lg shadow-emerald-200 mt-8"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <>{isSignUp ? t.signUp : t.signIn} <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              {isSignUp ? t.alreadyAccount : t.newToAgri}{" "}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-emerald-600 font-bold hover:underline"
              >
                {isSignUp ? t.signIn : t.createAccount}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
