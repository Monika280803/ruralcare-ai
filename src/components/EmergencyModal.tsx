import React from 'react';
import { X, PhoneCall, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { EMERGENCY_NUMBERS } from '../constants';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-rose-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                Emergency Helplines & Contacts
              </h3>
              <p className="text-xs text-rose-100">
                Direct access numbers for urgent medical emergencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">
                When to call emergency services immediately:
              </strong>
              <span>
                Severe breathing failure, chest pressure/tightness, sudden stroke symptoms (facial drop, arm weakness, slurred speech), intense bleeding, seizures, or unconsciousness.
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Emergency Numbers by Region
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EMERGENCY_NUMBERS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {item.country}
                    </p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <a
                    href={`tel:${item.number.split('/')[0].trim()}`}
                    className="inline-flex items-center gap-1 font-extrabold text-sm text-rose-700 bg-rose-100/70 hover:bg-rose-200 px-2.5 py-1 rounded-lg transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    {item.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong>Rural Community Advice:</strong> Identify your local village ambulance or village health worker in advance.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
