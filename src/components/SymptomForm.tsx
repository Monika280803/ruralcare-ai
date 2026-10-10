import React from 'react';
import {
  Sparkles,
  RotateCcw,
  AlertTriangle,
  Clock,
  User,
  Activity,
  CheckCircle2,
  Bookmark,
  Thermometer,
} from 'lucide-react';
import { TriageFormState, PresetScenario } from '../types';
import { WARNING_SIGNS_LIST, DURATION_OPTIONS, PRESET_SCENARIOS } from '../constants';

interface SymptomFormProps {
  formState: TriageFormState;
  setFormState: React.Dispatch<React.SetStateAction<TriageFormState>>;
  onAnalyze: () => void;
  onClear: () => void;
  isLoading: boolean;
  onLoadPreset: (preset: PresetScenario) => void;
}

export const SymptomForm: React.FC<SymptomFormProps> = ({
  formState,
  setFormState,
  onAnalyze,
  onClear,
  isLoading,
  onLoadPreset,
}) => {
  const handleWarningToggle = (label: string) => {
    setFormState((prev) => {
      const exists = prev.warningSigns.includes(label);
      return {
        ...prev,
        warningSigns: exists
          ? prev.warningSigns.filter((s) => s !== label)
          : [...prev.warningSigns, label],
      };
    });
  };

  const hasCriticalWarning = formState.warningSigns.some((sign) => {
    const item = WARNING_SIGNS_LIST.find((w) => w.label === sign);
    return item?.isCritical;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition">
      {/* Card Title & Preset Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Patient Assessment Form
            </h2>
            <p className="text-xs text-slate-500">
              Enter your current symptoms and health observations
            </p>
          </div>
        </div>
      </div>

      {/* Rural Clinical Presets for Quick Testing */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
          <Bookmark className="w-3.5 h-3.5 text-teal-600" />
          <span>Quick Example Scenarios (Rural Health):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onLoadPreset(preset)}
              className="text-[11px] font-medium bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAnalyze();
        }}
        className="mt-5 space-y-5"
      >
        {/* Row: Patient Age & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Patient Age */}
          <div>
            <label
              htmlFor="patient-age"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              Patient Age (Years) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="patient-age"
                type="number"
                min="0"
                max="125"
                required
                value={formState.age}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, age: e.target.value }))
                }
                placeholder="e.g. 35"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 pointer-events-none">
                yrs
              </span>
            </div>
            {/* Quick age shortcuts */}
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
              <span>Quick:</span>
              {[
                { label: 'Child (5)', val: '5' },
                { label: 'Teen (15)', val: '15' },
                { label: 'Adult (38)', val: '38' },
                { label: 'Elderly (68)', val: '68' },
              ].map((btn) => (
                <button
                  type="button"
                  key={btn.label}
                  onClick={() =>
                    setFormState((prev) => ({ ...prev, age: btn.val }))
                  }
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration of Symptoms */}
          <div>
            <label
              htmlFor="symptom-duration"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              Duration of Symptoms <span className="text-rose-500">*</span>
            </label>
            <select
              id="symptom-duration"
              value={formState.duration}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, duration: e.target.value }))
              }
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition cursor-pointer"
            >
              {DURATION_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1.5">
              How long has the patient been feeling unwell?
            </p>
          </div>
        </div>

        {/* Symptoms Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="symptoms-description"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Primary Symptoms <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {formState.symptoms.length} characters
            </span>
          </div>
          <textarea
            id="symptoms-description"
            rows={4}
            required
            value={formState.symptoms}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, symptoms: e.target.value }))
            }
            placeholder="Describe what you are feeling in simple words. For example: 'Sudden fever with shivering, sharp headache, back pain, and feeling weak since yesterday afternoon after working in the fields...'"
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition leading-relaxed"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Tip: Mention where it hurts, how intense it is, and any other changes you noticed.
          </p>
        </div>

        {/* Optional Context: Body Temperature & Health History */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label
              htmlFor="patient-temp"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1"
            >
              <Thermometer className="w-3.5 h-3.5 text-teal-600" />
              Body Temperature (Optional)
            </label>
            <input
              id="patient-temp"
              type="text"
              value={formState.temperature}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, temperature: e.target.value }))
              }
              placeholder="e.g. 101.5°F or 38.6°C"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="patient-history"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1"
            >
              Existing Conditions / Medications (Optional)
            </label>
            <input
              id="patient-history"
              type="text"
              value={formState.existingConditions}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  existingConditions: e.target.value,
                }))
              }
              placeholder="e.g. Diabetes, Asthma, High Blood Pressure"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            />
          </div>
        </div>

        {/* Critical Warning Signs Checklist */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Critical Warning Signs (Check any that apply)
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {formState.warningSigns.length} selected
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-2.5">
            Select any urgent danger signs currently present in the patient:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {WARNING_SIGNS_LIST.map((item) => {
              const isChecked = formState.warningSigns.includes(item.label);
              return (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition select-none ${
                    isChecked
                      ? item.isCritical
                        ? 'bg-rose-50 border-rose-300 text-rose-950 font-medium'
                        : 'bg-teal-50 border-teal-300 text-teal-950 font-medium'
                      : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleWarningToggle(item.label)}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="leading-snug">{item.label}</span>
                    {item.isCritical && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                        High Risk Red Flag
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          {/* Immediate Red Flag Banner if critical warning is selected */}
          {hasCriticalWarning && (
            <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 flex items-start gap-2.5 text-rose-900 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">
                  Potential Emergency Warning Sign Selected!
                </p>
                <p className="mt-0.5 text-rose-800">
                  You have checked one or more high-risk warning signs. Do not wait for an online assessment if the patient is deteriorating. Seek emergency medical transportation immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || !formState.symptoms.trim() || !formState.age}
            className={`flex-1 w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer ${
              isLoading || !formState.symptoms.trim() || !formState.age
                ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white shadow-teal-500/25 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Clinical Triage...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Symptoms</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Clear</span>
          </button>
        </div>
      </form>
    </div>
  );
};
