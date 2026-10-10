import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini client with standard telemetry User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface TriageRequestBody {
  age: number | string;
  symptoms: string;
  duration: string;
  warningSigns: string[];
  temperature?: string;
  existingConditions?: string;
  language?: string;
}

export interface TriageResponseData {
  summary: string;
  urgencyLevel: 'EMERGENCY' | 'URGENT' | 'MODERATE' | 'LOW_HOME_CARE';
  urgencyTitle: string;
  urgencyRationale: string;
  warningSigns: string[];
  recommendedNextSteps: string[];
  ruralCareTips: string[];
  questionsForDoctor: string[];
  potentialCategories: string[];
  disclaimer: string;
}

const triageResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'A clear, compassionate plain-language summary of the reported symptoms and patient profile.',
    },
    urgencyLevel: {
      type: Type.STRING,
      description: 'One of: EMERGENCY, URGENT, MODERATE, LOW_HOME_CARE.',
    },
    urgencyTitle: {
      type: Type.STRING,
      description: 'A short, prominent title for the urgency level (e.g. "Immediate Emergency Medical Evaluation Needed").',
    },
    urgencyRationale: {
      type: Type.STRING,
      description: 'Clear clinical explanation of why this urgency level was designated based on symptoms, age, and duration.',
    },
    warningSigns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of warning signs or red flags present or to monitor closely.',
    },
    recommendedNextSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Ordered, actionable practical next steps for the patient and caregivers.',
    },
    ruralCareTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Actionable guidance tailored to rural patients (transportation planning, distance to clinic, hydration, caregiver presence).',
    },
    questionsForDoctor: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 4 suggested questions the patient or caregiver can ask their clinic healthcare provider.',
    },
    potentialCategories: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'General health categories or symptom patterns to discuss with a clinician (NEVER a definitive diagnosis).',
    },
    disclaimer: {
      type: Type.STRING,
      description: 'Mandatory medical disclaimer stating this is preliminary guidance, not a diagnosis or prescription.',
    },
  },
  required: [
    'summary',
    'urgencyLevel',
    'urgencyTitle',
    'urgencyRationale',
    'warningSigns',
    'recommendedNextSteps',
    'ruralCareTips',
    'questionsForDoctor',
    'potentialCategories',
    'disclaimer',
  ],
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Triage evaluation endpoint
  app.post('/api/triage', async (req, res) => {
    try {
      const {
        age,
        symptoms,
        duration,
        warningSigns = [],
        temperature,
        existingConditions,
        language = 'English',
      } = req.body as TriageRequestBody;

      // Validation
      if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
        return res.status(400).json({
          error: 'Please enter symptoms to analyze.',
        });
      }

      if (!age) {
        return res.status(400).json({
          error: 'Please provide patient age.',
        });
      }

      const activeWarningSigns = Array.isArray(warningSigns) ? warningSigns : [];

      // Life-threatening override check:
      // Even if AI might be permissive, safety rule enforces severe symptoms
      const isCriticalWarningPresent = activeWarningSigns.some((sign) =>
        /chest pain|breathing|unconscious|fainting|stroke|speech|seizure|cyanosis|paralysis/i.test(sign)
      );

      const prompt = `
You are the medical triage intelligence engine of RuralCare AI, an accessible preliminary triage and symptom guidance assistant built specifically for patients and community health workers in rural and remote regions where medical centers may be distant.

PATIENT INFORMATION:
- Age: ${age} years old
- Primary Reported Symptoms: ${symptoms.trim()}
- Duration of Symptoms: ${duration || 'Not specified'}
- Warning Signs Noted by User: ${activeWarningSigns.length > 0 ? activeWarningSigns.join('; ') : 'None selected'}
- Recorded Body Temperature: ${temperature ? temperature : 'Not measured'}
- Existing Chronic Conditions / Medical History: ${existingConditions ? existingConditions : 'None reported'}
- Preferred Response Language: ${language}

STRICT CLINICAL SAFETY RULES:
1. DO NOT DIAGNOSE DISEASES: Never state "You have X". Instead suggest broad categories to discuss with a doctor (e.g. "Upper respiratory irritation vs. infectious etiology to be verified by a clinician").
2. DO NOT PRESCRIBE MEDICATIONS: Never prescribe prescription drugs or specific drug dosages.
3. PRELIMINARY TRIAGE ONLY: Always make it crystal clear this is preliminary triage to help the patient decide when and how to seek care.
4. LIFE-THREATENING OVERRIDE: If the patient reports severe chest pain radiating to arm/jaw, severe difficulty breathing, sudden face drooping/weakness/speech slurring, confusion, loss of consciousness, uncontrolled bleeding, severe stiff neck with high fever, or severe trauma, the urgencyLevel MUST be set to "EMERGENCY". A reassuring response MUST NEVER override acute red flags.
5. RURAL REALITY CONSIDERATIONS: Provide practical advice for rural contexts where clinics may be miles away or have limited hours (e.g., arrange transport early, bring existing prescription bottles, keep a companion along, use clean boiled water for hydration, monitor temperature closely).
6. URGENCY LEVELS:
   - "EMERGENCY": Immediate emergency medical assistance or hospital transport needed right away.
   - "URGENT": Needs in-person clinical exam within 24 hours at the nearest health center or clinic.
   - "MODERATE": Needs clinical consultation within 2 to 3 days if not improving or if symptoms change.
   - "LOW_HOME_CARE": Mild self-limiting symptoms suitable for supportive home care (rest, hydration) with watchful waiting.
7. LANGUAGE: Provide the output content in ${language}.

Respond strictly in JSON matching the specified schema.
`;

      if (!process.env.GEMINI_API_KEY) {
        // Fallback rule-based triage if API key is not yet set in environment
        console.warn('GEMINI_API_KEY is not set. Generating safe clinical fallback.');
        const fallbackUrgency = isCriticalWarningPresent
          ? 'EMERGENCY'
          : activeWarningSigns.length > 0
          ? 'URGENT'
          : 'MODERATE';

        const fallbackData: TriageResponseData = {
          summary: `Patient (${age} years old) reports ${symptoms}. Duration: ${duration || 'unspecified'}.`,
          urgencyLevel: fallbackUrgency,
          urgencyTitle:
            fallbackUrgency === 'EMERGENCY'
              ? 'Immediate Emergency Medical Evaluation Required'
              : fallbackUrgency === 'URGENT'
              ? 'Prompt Clinic Visit Recommended (Within 24 Hours)'
              : 'Medical Consultation Recommended Within 2-3 Days',
          urgencyRationale: isCriticalWarningPresent
            ? 'Critical warning signs were detected in your input. Life-threatening conditions cannot be ruled out without an immediate in-person medical evaluation.'
            : 'Given the symptoms and reported duration, an evaluation at a local community clinic will ensure proper assessment and rule out complications.',
          warningSigns: activeWarningSigns.length > 0
            ? activeWarningSigns
            : ['Sudden worsening of symptoms', 'Development of high fever or breathing distress', 'Inability to keep liquids down'],
          recommendedNextSteps: [
            isCriticalWarningPresent
              ? 'Contact local emergency services or arrange immediate safe transport to the nearest hospital.'
              : 'Visit your local primary health centre or community clinic for an in-person physical examination.',
            'Keep a record of temperature, symptom changes, and all current medications.',
            'Ensure a family member or caregiver stays close by.',
          ],
          ruralCareTips: [
            'Check local clinic hours and arrange travel before sundown or inclement weather.',
            'Carry your identification and any medication containers or health cards.',
            'Stay hydrated with clean boiled water or oral rehydration fluids if tolerated.',
          ],
          questionsForDoctor: [
            'What tests or physical examinations do I need today?',
            'What specific warning signs should make me return immediately?',
            'Are there supportive remedies safe for my age and health history?',
          ],
          potentialCategories: [
            'Symptom complex requiring clinical physical examination',
            'Possible acute inflammatory or infectious presentation',
          ],
          disclaimer:
            'RuralCare AI is a preliminary guidance and triage aid, not a medical doctor or diagnostic tool. Never delay seeking in-person emergency care.',
        };

        return res.json({
          success: true,
          data: fallbackData,
          source: 'clinical-fallback',
        });
      }

      // Call Gemini model with retry and fallback
      let parsedData: TriageResponseData | null = null;
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

      for (const modelName of modelsToTry) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: triageResponseSchema,
                temperature: 0.2,
              },
            });

            const responseText = response.text;
            if (responseText) {
              parsedData = JSON.parse(responseText.trim());
              if (parsedData) break;
            }
          } catch (callError: unknown) {
            console.warn(
              `Model ${modelName} attempt ${attempt} encountered error:`,
              callError instanceof Error ? callError.message : callError
            );
            // Small pause before retry
            await new Promise((r) => setTimeout(r, 600));
          }
        }
        if (parsedData) break;
      }

      // If both model calls failed (e.g. 503 unavailable spikes), gracefully return clinical triage fallback
      if (!parsedData) {
        console.warn('Gemini models temporarily unavailable. Generating clinical rule-based triage.');
        const fallbackUrgency = isCriticalWarningPresent
          ? 'EMERGENCY'
          : activeWarningSigns.length > 0
          ? 'URGENT'
          : 'MODERATE';

        parsedData = {
          summary: `Patient (${age} yrs old) reports: "${symptoms.trim()}". Reported duration: ${duration || 'unspecified'}.${temperature ? ` Recorded temperature: ${temperature}.` : ''}`,
          urgencyLevel: fallbackUrgency,
          urgencyTitle:
            fallbackUrgency === 'EMERGENCY'
              ? 'Immediate Emergency Medical Evaluation Required'
              : fallbackUrgency === 'URGENT'
              ? 'Prompt Clinic Visit Recommended (Within 24 Hours)'
              : 'Medical Consultation Advised in 2-3 Days',
          urgencyRationale: isCriticalWarningPresent
            ? 'Critical red flags (potential cardiovascular, neurological, or respiratory distress) were detected in the reported symptoms. In-person emergency care is crucial.'
            : activeWarningSigns.length > 0
            ? 'Warning signs were noted that require physical medical evaluation within 24 hours to prevent complications.'
            : 'Symptoms warrant in-person clinical assessment by a doctor or health worker to determine cause and appropriate care.',
          warningSigns: activeWarningSigns.length > 0
            ? activeWarningSigns
            : [
                'Sudden worsening or spread of symptoms',
                'Onset of high fever, chills, or difficulty breathing',
                'Inability to tolerate oral fluids or food',
              ],
          recommendedNextSteps: [
            isCriticalWarningPresent
              ? 'Call emergency services or arrange safe, rapid transport to the nearest hospital emergency department.'
              : 'Travel to your nearest community health center or primary clinic for physical examination.',
            'Keep patient calm, hydrated (if able to swallow safely), and resting comfortably.',
            'Gather all existing medication containers, recent medical records, and identification.',
          ],
          ruralCareTips: [
            'Confirm clinic operating hours and arrange transport with a neighbor or family member before traveling.',
            'Bring clean drinking water and a companion to assist during the journey.',
            'Keep a written log of when symptoms change or worsen.',
          ],
          questionsForDoctor: [
            'What is the most likely cause of these symptoms?',
            'Are there specific danger signs that mean I should return to the clinic immediately?',
            'What supportive care or tests are recommended today?',
          ],
          potentialCategories: [
            'Acute symptomatic presentation requiring physical examination',
            'Possible infection, inflammation, or systemic strain',
          ],
          disclaimer:
            'RuralCare AI provides preliminary triage guidance for rural navigation, not a medical diagnosis or prescription. In an emergency, contact local ambulance or hospital services immediately.',
        };
      }

      // Safety check: ensure life-threatening symptoms are NEVER downgraded
      if (isCriticalWarningPresent && parsedData.urgencyLevel !== 'EMERGENCY') {
        parsedData.urgencyLevel = 'EMERGENCY';
        parsedData.urgencyTitle = 'Immediate Emergency Medical Evaluation Required';
        if (!parsedData.warningSigns.some((w) => /critical|red flag|emergency/i.test(w))) {
          parsedData.warningSigns.unshift('Critical red flag symptoms reported requiring immediate attention');
        }
      }

      return res.json({
        success: true,
        data: parsedData,
        source: 'ruralcare-engine',
      });
    } catch (err: unknown) {
      console.error('Error during triage processing:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred during triage analysis.';
      return res.status(500).json({
        error: errorMessage,
        suggestion:
          'Please verify the symptom details or seek immediate local medical assistance if in distress.',
      });
    }
  });

  // Serve static files or Vite middlewares
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RuralCare AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start RuralCare AI server:', error);
  process.exit(1);
});
