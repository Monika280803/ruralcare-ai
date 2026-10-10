import React from 'react';
import { HeartPulse, PhoneCall, AlertTriangle, ShieldCheck, Globe } from 'lucide-react';

interface HeaderProps {
  onShowEmergencyHotlines: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onShowEmergencyHotlines,
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <header className="bg-white border-b border-teal-100/80 shadow-xs sticky top-0 z-30">
      {/* Top Emergency Advisory Bar */}
      <div className="bg-rose-50 border-b border-rose-100 text-rose-800 px-4 py-2 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
            <span>
              <strong>Emergency Notice:</strong> If you or the patient has severe chest pain, inability to breathe, or loss of consciousness, seek immediate emergency help.
            </span>
          </div>
          <button
            onClick={onShowEmergencyHotlines}
            className="inline-flex items-center gap-1.5 font-semibold text-rose-700 hover:text-rose-900 bg-rose-100/80 hover:bg-rose-200 px-2.5 py-1 rounded-full text-xs transition cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Emergency Helplines
          </button>
        </div>
      </div>

      {/* Main Brand & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
            <HeartPulse className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                RuralCare <span className="text-teal-600 font-extrabold">AI</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Rural Triage
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Symptom Checker & Triage Assistant • Preliminary health guidance for rural communities
            </p>
          </div>
        </div>

        {/* Quick controls: Language Selector & Status */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <select
              aria-label="Guidance Language"
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <button
            onClick={onShowEmergencyHotlines}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Emergency Numbers</span>
            <span className="sm:hidden">Helplines</span>
          </button>
        </div>
      </div>
    </header>
  );
};
