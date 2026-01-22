
import React from 'react';
import { Linkedin, Mail, Twitter, User } from 'lucide-react';
import { Language, getTranslation } from '../translations';

interface TeamPageProps {
  language: Language;
}

const members = [
  {
    name: 'Anuj Shinde',
    role: 'Full Stack Developer',
    bio: 'Expert in building scalable web architectures and leading end-to-end technical implementations for AgriAgent.',
  },
  {
    name: 'Sofin Shaikh',
    role: 'Backend Developer',
    bio: 'Specialist in high-performance server logic, database optimization, and secure AI API integrations.',
  },
  {
    name: 'Apurva Pawar',
    role: 'UI/UX Designer',
    bio: 'Passionate about creating intuitive, user-centric interfaces that empower farmers through accessible design.',
  },
  {
    name: 'Mandar Kumatkar',
    role: 'Frontend Developer',
    bio: 'Expert in crafting responsive, high-performance user interfaces and ensuring a seamless cross-platform experience.',
  }
];

const TeamPage: React.FC<TeamPageProps> = ({ language }) => {
  const t = getTranslation(language).teamPage;

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 animate-in fade-in duration-500">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">{t.title}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {members.map((m) => (
          <div key={m.name} className="group flex flex-col items-center text-center bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm transition-all hover:shadow-md">
            <div className="relative mb-6 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden aspect-square shadow-sm transition-transform group-hover:-translate-y-2 w-full max-w-[200px] border-4 border-white">
              <User className="w-20 h-20 text-slate-300 group-hover:text-emerald-200 transition-colors" />
              <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-all"></div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{m.name}</h3>
            <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-4">{m.role}</p>
            <p className="text-slate-500 text-xs leading-relaxed mb-6 px-2">
              {m.bio}
            </p>
            <div className="flex gap-4 mt-auto">
              <Linkedin className="h-4 w-4 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors" />
              <Twitter className="h-4 w-4 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors" />
              <Mail className="h-4 w-4 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-32 p-12 bg-white rounded-[3rem] border border-slate-100 text-center shadow-sm">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-slate-600 max-w-3xl mx-auto italic text-xl leading-relaxed">
          "To democratize access to advanced agricultural data, ensuring that every farmer in the Pune region and beyond can achieve maximum yields while preserving their land for future generations."
        </p>
      </div>
    </div>
  );
};

export default TeamPage;
