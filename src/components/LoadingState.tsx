import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, HeartPulse, Stethoscope } from 'lucide-react';

export const LoadingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Evaluating patient symptoms & age profile...',
    'Checking clinical red flags and urgency tier...',
    'Synthesizing practical rural care recommendations...',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1400);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-2xl border border-teal-100 p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[360px]">
      {/* Animated Pulse Badge */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-inner">
          <Activity className="w-8 h-8 animate-pulse" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-teal-400/20 animate-ping pointer-events-none" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-800">
        RuralCare AI is Analyzing Symptoms...
      </h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        Processing preliminary clinical triage guidance with Google Gemini.
      </p>

      {/* Progress steps */}
      <div className="mt-6 w-full max-w-xs space-y-2.5">
        {steps.map((text, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition ${
                isCurrent
                  ? 'bg-teal-50 border border-teal-200 text-teal-900 font-semibold'
                  : isDone
                  ? 'bg-slate-50 text-slate-600 line-through decoration-slate-300'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              {isDone ? (
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span className="text-left">{text}</span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 mt-6 italic">
        Please do not refresh the page.
      </p>
    </div>
  );
};
