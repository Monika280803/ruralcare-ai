import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Volume2,
  VolumeX,
  Printer,
  Copy,
  Check,
  Stethoscope,
  Compass,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { TriageResponse, UrgencyLevel } from '../types';

interface TriageResultProps {
  result: TriageResponse;
  onReset: () => void;
  onShowEmergencyHotlines: () => void;
}

export const TriageResult: React.FC<TriageResultProps> = ({
  result,
  onReset,
  onShowEmergencyHotlines,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Styling and configuration based on urgency level
  const getUrgencyConfig = (level: UrgencyLevel) => {
    switch (level) {
      case 'EMERGENCY':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-400',
          accentBg: 'bg-rose-600',
          textColor: 'text-rose-950',
          badgeText: 'text-white bg-rose-600',
          icon: <AlertOctagon className="w-7 h-7 text-rose-600 shrink-0 animate-bounce" />,
          title: 'Immediate Emergency Care Required',
          description:
            'Critical danger signs or severe symptoms reported. Do not delay. Call emergency transport or travel to the nearest hospital immediately.',
          bannerBorder: 'border-l-8 border-rose-600',
        };
      case 'URGENT':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          accentBg: 'bg-amber-500',
          textColor: 'text-amber-950',
          badgeText: 'text-amber-900 bg-amber-200',
          icon: <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />,
          title: 'Prompt Clinic Visit Recommended',
          description:
            'Evaluation needed within 24 hours at your nearest primary health center, community clinic, or urgent care doctor.',
          bannerBorder: 'border-l-8 border-amber-500',
        };
      case 'MODERATE':
        return {
          bg: 'bg-sky-50',
          border: 'border-sky-300',
          accentBg: 'bg-sky-600',
          textColor: 'text-sky-950',
          badgeText: 'text-sky-900 bg-sky-200',
          icon: <Clock className="w-7 h-7 text-sky-600 shrink-0" />,
          title: 'Standard Medical Consultation Advised',
          description:
            'Schedule a visit with a healthcare provider in the next 2 to 3 days if symptoms persist or do not improve.',
          bannerBorder: 'border-l-8 border-sky-500',
        };
      case 'LOW_HOME_CARE':
      default:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-300',
          accentBg: 'bg-emerald-600',
          textColor: 'text-emerald-950',
          badgeText: 'text-emerald-900 bg-emerald-200',
          icon: <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />,
          title: 'Supportive Home Care & Monitoring',
          description:
            'Symptoms appear suitable for supportive self-care, rest, and hydration. Monitor closely and visit a clinic if condition worsens.',
          bannerBorder: 'border-l-8 border-emerald-500',
        };
    }
  };

  const urgencyConfig = getUrgencyConfig(result.urgencyLevel);

  // Text to speech for accessibility in rural areas
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = `
      Urgency Level: ${result.urgencyTitle}.
      Summary of reported symptoms: ${result.summary}.
      Why this urgency level: ${result.urgencyRationale}.
      Key warning signs to watch: ${result.warningSigns.join(', ')}.
      Recommended next steps: ${result.recommendedNextSteps.join('. ')}.
      Important reminder: This is preliminary guidance and not a medical diagnosis.
    `;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Copy report summary to clipboard
  const handleCopySummary = async () => {
    const textToCopy = `
=== RURALCARE AI TRIAGE REPORT ===
Urgency: ${result.urgencyTitle} (${result.urgencyLevel})
Rationale: ${result.urgencyRationale}

Symptoms Summary:
${result.summary}

Warning Signs:
${result.warningSigns.map((w) => `• ${w}`).join('\n')}

Recommended Next Steps:
${result.recommendedNextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Rural Health Tips:
${result.ruralCareTips.map((t) => `• ${t}`).join('\n')}

Questions For Doctor:
${result.questionsForDoctor.map((q) => `? ${q}`).join('\n')}

Disclaimer: ${result.disclaimer}
    `.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  // Trigger print dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 print:space-y-4 print:m-0">
      {/* Top Action Bar: Read aloud, Copy, Print */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-2xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Triage Assessment Complete
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Read aloud button */}
          <button
            type="button"
            onClick={toggleSpeech}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
              isSpeaking
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border-slate-200'
            }`}
            title="Listen to guidance read aloud"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Read Aloud</span>
              </>
            )}
          </button>

          {/* Copy Report */}
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
            title="Copy report text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          {/* Print / Save PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / Save PDF</span>
          </button>

          {/* Reset form button */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            New Check
          </button>
        </div>
      </div>

      {/* 1. Preliminary Urgency Level Banner Card */}
      <div
        className={`rounded-2xl border-2 ${urgencyConfig.border} ${urgencyConfig.bg} ${urgencyConfig.bannerBorder} p-5 sm:p-6 shadow-sm`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
          <div className="flex items-start sm:items-center gap-3.5">
            {urgencyConfig.icon}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Preliminary Urgency Level:
                </span>
                <span
                  className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${urgencyConfig.badgeText}`}
                >
                  {result.urgencyLevel.replace(/_/g, ' ')}
                </span>
              </div>
              <h3 className={`text-lg sm:text-xl font-extrabold ${urgencyConfig.textColor} mt-1`}>
                {result.urgencyTitle}
              </h3>
            </div>
          </div>

          {result.urgencyLevel === 'EMERGENCY' && (
            <button
              onClick={onShowEmergencyHotlines}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition animate-pulse cursor-pointer shrink-0"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Call Emergency Help</span>
            </button>
          )}
        </div>

        {/* Clinical Rationale */}
        <div className="mt-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          <p>{result.urgencyRationale}</p>
        </div>
      </div>

      {/* 2. Summary of Reported Symptoms Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2.5">
          <FileText className="w-4 h-4 text-teal-600" />
          <h4>1. Summary of Reported Symptoms</h4>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-normal">
          {result.summary}
        </p>

        {result.potentialCategories && result.potentialCategories.length > 0 && (
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              General Clinical Focus Areas to Discuss:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.potentialCategories.map((cat, i) => (
                <span
                  key={i}
                  className="text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200/70 px-2.5 py-0.5 rounded-lg"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Important Warning Signs & Red Flags Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h4>2. Important Warning Signs to Monitor</h4>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          If any of the following symptoms develop or worsen, immediately escalate to emergency medical care:
        </p>
        <div className="space-y-2">
          {result.warningSigns.map((warning, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm text-amber-950 font-medium"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recommended Next Steps Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2.5">
          <ArrowRight className="w-4 h-4 text-teal-600" />
          <h4>3. Recommended Next Steps</h4>
        </div>
        <div className="space-y-2.5">
          {result.recommendedNextSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs sm:text-sm text-slate-800"
            >
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Rural Health Considerations & Travel Planning */}
      {result.ruralCareTips && result.ruralCareTips.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2.5">
            <Compass className="w-4 h-4 text-sky-600" />
            <h4>4. Practical Guidance for Rural & Remote Areas</h4>
          </div>
          <p className="text-xs text-slate-500 mb-2.5">
            Helpful tips when dealing with distance to clinics, transportation, and home care:
          </p>
          <ul className="space-y-2">
            {result.ruralCareTips.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-sky-50/40 border border-sky-100 p-2.5 rounded-xl"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Questions to Ask the Clinic Doctor */}
      {result.questionsForDoctor && result.questionsForDoctor.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2.5">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <h4>5. Questions to Ask Your Clinic Healthcare Provider</h4>
          </div>
          <p className="text-xs text-slate-500 mb-2.5">
            Write down or show these questions to your doctor or community nurse:
          </p>
          <div className="space-y-1.5">
            {result.questionsForDoctor.map((question, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
              >
                <span className="font-bold text-teal-600 shrink-0">Q{i + 1}:</span>
                <span className="italic">"{question}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Mandatory Clinical Safety Disclaimer Card */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900">
            Important Medical & Safety Disclaimer:
          </p>
          <p className="mt-1 text-amber-900/90">
            {result.disclaimer ||
              'RuralCare AI is an automated preliminary guidance and triage tool intended to assist with health navigation. It does not provide a formal medical diagnosis, write prescriptions, or replace consultation with a qualified doctor or emergency service. In a life-threatening crisis, call local emergency responders immediately.'}
          </p>
        </div>
      </div>
    </div>
  );
};
