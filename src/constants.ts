import { PresetScenario } from './types';

export const WARNING_SIGNS_LIST = [
  {
    id: 'chest_pain',
    label: 'Chest pain, tight pressure, or radiating pain to arm/jaw',
    isCritical: true,
  },
  {
    id: 'difficulty_breathing',
    label: 'Severe shortness of breath, struggling to speak in full sentences',
    isCritical: true,
  },
  {
    id: 'sudden_weakness',
    label: 'Sudden weakness, facial drooping, or slurred speech (FAST signs)',
    isCritical: true,
  },
  {
    id: 'loss_of_consciousness',
    label: 'Fainting, confusion, disorientation, or loss of consciousness',
    isCritical: true,
  },
  {
    id: 'high_fever_stiff_neck',
    label: 'High fever (>103°F / 39.4°C) with stiff neck or severe sudden headache',
    isCritical: true,
  },
  {
    id: 'severe_abdominal_pain',
    label: 'Severe, unrelenting abdominal pain or repeated severe vomiting',
    isCritical: false,
  },
  {
    id: 'deep_wound_infection',
    label: 'Deep farm/animal wound, puncture, or rapidly expanding red streaks',
    isCritical: false,
  },
  {
    id: 'inability_to_drink',
    label: 'Signs of severe dehydration, dry mouth, or inability to keep fluids down',
    isCritical: false,
  },
];

export const DURATION_OPTIONS = [
  'Under 24 hours (acute)',
  '1 to 3 days',
  '4 to 7 days',
  '1 to 2 weeks',
  'Over 2 weeks (persistent/chronic)',
];

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'field_fever',
    label: 'Fever & Chills After Field Work',
    tag: 'Agricultural / Rural',
    age: '42',
    duration: '1 to 3 days',
    symptoms:
      'High spiking fever, shivering chills, intense headache, and severe body and lower back aches after working outdoors in damp agricultural fields. Slight sweating and loss of appetite.',
    warningSigns: [],
    temperature: '102.4°F (39.1°C)',
    conditions: 'None',
  },
  {
    id: 'chest_emergency',
    label: 'Severe Chest Pressure at Rest',
    tag: 'Emergency Check',
    age: '58',
    duration: 'Under 24 hours (acute)',
    symptoms:
      'Heavy squeezing pressure in the center of my chest that started 45 minutes ago while resting. The ache is radiating to my left shoulder and jaw, accompanied by cold sweat and nausea.',
    warningSigns: [
      'Chest pain, tight pressure, or radiating pain to arm/jaw',
      'Severe shortness of breath, struggling to speak in full sentences',
    ],
    temperature: '98.6°F (Normal)',
    conditions: 'Hypertension (High Blood Pressure)',
  },
  {
    id: 'child_cough',
    label: 'Toddler with Barking Cough & Fever',
    tag: 'Pediatric Care',
    age: '4',
    duration: '1 to 3 days',
    symptoms:
      '4-year-old child has a harsh, seal-like barking cough that gets worse at night, mild runny nose, and low energy. Breathing sounds a bit raspy when crying, but able to drink sips of water.',
    warningSigns: [],
    temperature: '101.1°F (38.4°C)',
    conditions: 'None',
  },
  {
    id: 'farm_cut',
    label: 'Farm Tool Cut with Red Swelling',
    tag: 'Wound Care',
    age: '33',
    duration: '1 to 3 days',
    symptoms:
      'Cut hand on a rusty metal farm fence wire two days ago. Cleaned with tap water at the time, but now the skin around the cut is puffy, hot to the touch, throbbing, and red streaks are spreading up the wrist.',
    warningSigns: [
      'Deep farm/animal wound, puncture, or rapidly expanding red streaks',
    ],
    temperature: '99.8°F (Low fever)',
    conditions: 'Last tetanus shot unknown (over 8 years ago)',
  },
  {
    id: 'heat_exhaustion',
    label: 'Dizziness & Cramps in Extreme Heat',
    tag: 'Environmental / Heat',
    age: '65',
    duration: 'Under 24 hours (acute)',
    symptoms:
      'Felt dizzy, lightheaded, and had calf muscle cramps after working in open heat at 96°F. Pale skin, heavy sweating, dark urine, and mild nausea.',
    warningSigns: [
      'Signs of severe dehydration, dry mouth, or inability to keep fluids down',
    ],
    temperature: '100.2°F (37.9°C)',
    conditions: 'Type 2 Diabetes',
  },
];

export const EMERGENCY_NUMBERS = [
  { country: 'United States & Canada', number: '911', desc: 'Emergency' },
  { country: 'India', number: '108 / 112', desc: 'National Ambulance / Emergency' },
  { country: 'European Union / UK', number: '112 / 999', desc: 'Universal Emergency' },
  { country: 'Australia', number: '000', desc: 'Emergency' },
  { country: 'Mexico & Latin America', number: '911', desc: 'Emergencias' },
];

export const RURAL_HEALTH_TIPS = [
  {
    title: 'Traveling to a Distant Rural Health Center',
    content:
      'If your nearest clinic is far away, call ahead if possible to ensure an on-duty clinician or nurse is present. Bring all current medications, health identification, and arrange safe transportation with a companion.',
  },
  {
    title: 'Safe Hydration & Oral Rehydration Salts (ORS)',
    content:
      'For fever, diarrhea, or heat illness in remote areas, always boil drinking water for 1-2 minutes. Use oral rehydration salt packets or mix 6 level teaspoons of sugar and 1/2 level teaspoon of salt in 1 liter of safe drinking water.',
  },
  {
    title: 'Field Wounds & Tetanus Safety',
    content:
      'Punctures from farm soil, rusted tools, or animal bites carry a high risk of tetanus and anaerobic infection. Wash immediately under clean running water with soap for 5 minutes and visit the clinic for tetanus vaccination.',
  },
];
