import React from 'react';
import {
  HeartPulse,
  Clock,
  Compass,
  ShieldCheck,
  Stethoscope,
  MapPin,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { RURAL_HEALTH_TIPS } from '../constants';

export const InitialGuide: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Welcome & How It Works Card */}
      <div className="bg-gradient-to-br from-teal-50/80 via-white to-sky-50/60 rounded-2xl border border-teal-100 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              How RuralCare AI Works
            </h3>
            <p className="text-xs text-slate-500">
              Fast, preliminary health navigation for individuals & remote clinics
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          Living far from health centers can make deciding when to seek care challenging. RuralCare AI uses Google Gemini’s clinical intelligence to assess your reported symptoms against medical triage indicators and recommend appropriate next steps.
        </p>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white/90 border border-teal-100/80 shadow-2xs">
            <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center mb-2">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">
              Enter Symptoms
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Provide age, duration, how you feel, and check any warning signs.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/90 border border-teal-100/80 shadow-2xs">
            <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center mb-2">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">
              AI Triage
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Evaluates urgency (Emergency, Urgent clinic visit, or Home care).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/90 border border-teal-100/80 shadow-2xs">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-2">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">
              Action Plan
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Receive practical rural steps, travel prep, and questions for your doctor.
            </p>
          </div>
        </div>
      </div>

      {/* Rural Health & Preparedness Tips */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Compass className="w-4 h-4 text-teal-600" />
          <h4>Rural Health Navigation Tips</h4>
        </div>

        <div className="space-y-2.5">
          {RURAL_HEALTH_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50/70 border border-slate-100"
            >
              <p className="text-xs font-bold text-slate-800 mb-0.5">
                {tip.title}
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {tip.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Safety Guarantee */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 flex items-start gap-3 text-slate-600 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800">
            Privacy Protected & Non-Diagnostic
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            No personal identifying medical records are stored. This tool does not diagnose medical conditions or prescribe drugs. Always consult a licensed healthcare practitioner.
          </p>
        </div>
      </div>
    </div>
  );
};
