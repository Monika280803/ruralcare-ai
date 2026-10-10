/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { SymptomForm } from './components/SymptomForm';
import { TriageResult } from './components/TriageResult';
import { InitialGuide } from './components/InitialGuide';
import { LoadingState } from './components/LoadingState';
import { EmergencyModal } from './components/EmergencyModal';
import { TriageFormState, TriageResponse, PresetScenario } from './types';
import { AlertCircle, RefreshCw, HeartPulse, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';

const INITIAL_FORM_STATE: TriageFormState = {
  age: '',
  gender: '',
  duration: '1 to 3 days',
  symptoms: '',
  temperature: '',
  existingConditions: '',
  warningSigns: [],
  language: 'English',
};

export default function App() {
  const [formState, setFormState] = useState<TriageFormState>(INITIAL_FORM_STATE);
  const [triageResult, setTriageResult] = useState<TriageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    setErrorMessage(null);

    // Validation
    if (!formState.age.trim()) {
      setErrorMessage('Please enter the patient’s age.');
      return;
    }

    if (!formState.symptoms.trim()) {
      setErrorMessage('Please describe the symptoms in the text box.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: formState.age,
          symptoms: formState.symptoms,
          duration: formState.duration,
          warningSigns: formState.warningSigns,
          temperature: formState.temperature,
          existingConditions: formState.existingConditions,
          language: formState.language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze symptoms. Please try again.');
      }

      setTriageResult(data.data);

      // Scroll smoothly to results on mobile devices
      setTimeout(() => {
        if (resultsRef.current && window.innerWidth < 1024) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: unknown) {
      console.error('Triage API Error:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected network error occurred.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormState(INITIAL_FORM_STATE);
    setTriageResult(null);
    setErrorMessage(null);
  };

  const handleLoadPreset = (preset: PresetScenario) => {
    setFormState((prev) => ({
      ...prev,
      age: preset.age,
      duration: preset.duration,
      symptoms: preset.symptoms,
      warningSigns: preset.warningSigns,
      temperature: preset.temperature || '',
      existingConditions: preset.conditions || '',
    }));
    setTriageResult(null);
    setErrorMessage(null);
  };

  const handleLanguageChange = (lang: string) => {
    setFormState((prev) => ({ ...prev, language: lang }));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Header */}
      <Header
        onShowEmergencyHotlines={() => setShowEmergencyModal(true)}
        selectedLanguage={formState.language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Banner for Rural Clinicians & Patients */}
        <div className="mb-6 bg-gradient-to-r from-teal-700 via-teal-800 to-sky-900 text-white rounded-2xl p-5 sm:p-6 shadow-md shadow-teal-950/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white tracking-wide uppercase">
                Remote Health Assistant
              </span>
              <span className="text-xs text-teal-200">Powered by Gemini AI</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Symptom Evaluation & Clinical Urgency Guidance
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl">
              Specially designed for rural families and community healthcare workers to evaluate urgency, identify danger signs, and plan hospital or clinic travel safely.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-rose-300" />
              <span>Emergency Help Info</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold">Analysis Request Failed</p>
                <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
                <p className="text-[11px] text-rose-600 mt-1">
                  If this is a health emergency, please do not wait for the website. Call local emergency responders or visit the nearest clinic immediately.
                </p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 px-2 py-1 rounded-md hover:bg-rose-100 transition cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Symptom Input Form */}
          <div className="lg:col-span-5 space-y-4">
            <SymptomForm
              formState={formState}
              setFormState={setFormState}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              isLoading={isLoading}
              onLoadPreset={handleLoadPreset}
            />
          </div>

          {/* Right Column: Results / Loading / Initial Guide */}
          <div ref={resultsRef} className="lg:col-span-7">
            {isLoading ? (
              <LoadingState />
            ) : triageResult ? (
              <TriageResult
                result={triageResult}
                onReset={handleClear}
                onShowEmergencyHotlines={() => setShowEmergencyModal(true)}
              />
            ) : (
              <InitialGuide />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200/80 py-6 px-4 sm:px-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-teal-600 flex items-center justify-center text-white">
              <HeartPulse className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-700">RuralCare AI</span>
            <span>• Accessible Healthcare Triage for Rural & Remote Communities</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Educational preliminary aid. Always consult a licensed medical doctor.
          </div>
        </div>
      </footer>

      {/* Emergency Helpline Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
}
