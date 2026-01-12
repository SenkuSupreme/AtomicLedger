import OpenAI from 'openai';

// Institutional Neural Nexus - Multi-Key & Multi-Model Redundancy Protocol
const API_KEYS = [
  process.env.OPENROUTER_API_KEY,
  process.env.OPENROUTER_API_KEY_2,
  process.env.OPENROUTER_API_KEY_3,
  process.env.OPENROUTER_API_KEY_4,
  process.env.OPENROUTER_API_KEY_5,
  process.env.OPENROUTER_API_KEY_6,
  process.env.OPENROUTER_API_KEY_7,
  process.env.OPENROUTER_API_KEY_8
].filter(Boolean) as string[];

// Verified Stable Free Models (Prioritized by performance and availability)
export const FALLBACK_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "nousresearch/hermes-3-405b:free",
  "meta-llama/llama-3.1-405b-instruct:free",
  "qwen/qwen2.5-vl-7b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "mistralai/mistral-7b-instruct:free"
];

const getClient = (apiKey: string) => new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    "HTTP-Referer": "https://journalingapp.vercel.app",
    "X-Title": "ApexLedger Institutional Nexus",
  },
});

interface NeuralRequest {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * High-Resilience Neural Completion Engine
 * Cycles through all available API keys and fallback models until success.
 */
export async function neuralCompletion({
  messages,
  model = FALLBACK_MODELS[0],
  temperature = 0.7,
  max_tokens = 1000
}: NeuralRequest) {
  const keysToTry = API_KEYS.length > 0 ? API_KEYS : [process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder'];
  
  // Create a priority list of models (user requested first, then the rest of fallbacks)
  const modelsToTry = [model, ...FALLBACK_MODELS.filter(m => m !== model)];

  for (const key of keysToTry) {
    const client = getClient(key);
    
    for (const targetModel of modelsToTry) {
      try {
        const completion = await client.chat.completions.create({
          model: targetModel,
          messages: messages as any,
          temperature,
          max_tokens,
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          return {
            content,
            model: targetModel,
            keyUsed: key.slice(0, 10) + '...',
          };
        }
      } catch (err: any) {
        const status = err?.status || err?.code;
        console.warn(`[Neural Nexus] Node failure: Key=${key.slice(0, 5)}... Model=${targetModel} Status=${status}`);
        
        // If 429 (Rate Limit), pivot to next key immediately
        if (status === 429) {
          break; // Exit model loop for this key, move to next key in outer loop
        }
        
        // Otherwise, try next model with same key
        continue;
      }
    }
  }

  throw new Error('NEURAL_BLACKOUT: All institutional nodes and keys exhausted.');
}

/**
 * @deprecated Use neuralCompletion for resilient multi-key logic
 */
export async function queryAI(prompt: string, model: string = FALLBACK_MODELS[0]) {
  try {
    const res = await neuralCompletion({
      messages: [{ role: 'user', content: prompt }],
      model
    });
    return res.content;
  } catch (error) {
    console.error('Deprecated queryAI error:', error);
    return null;
  }
}

// Global Prompt Templates
export const PROMPTS = {
  SUGGEST_TAGS: (note: string) => `
    Analyze the following trade note and suggest short, relevant tags (max 5) with confidence scores (0-1). 
    Output ONLY a JSON array of objects: [{ "tag": "string", "confidence": number }].
    Note: "${note}"
  `,
  ANALYZE_SENTIMENT: (note: string) => `
    Analyze the sentiment of this trade journal entry.
    Output ONLY a JSON object with: { "sentiment": "positive"|"negative"|"neutral"|"stressed", "keywords": ["word1", "word2"] }.
    Entry: "${note}"
  `,
  EVALUATE_STRATEGY: (metrics: string) => `
    Evaluate this trading strategy based on the following metrics: ${metrics}.
    Provide a score (0-100) and brief improvement suggestions.
    Output ONLY JSON: { "score": number, "analysis": "string" }.
  `,
  SUGGEST_ENTRY_EXIT: (asset: string, timeframe: string, priceHistory: string) => `
    Analyze the following price history snippet for ${asset} on ${timeframe} timeframe.
    Suggest optimal entry and exit criteria with rationale.
    Output ONLY JSON: { "entry": "string", "exit": "string", "rationale": "string" }.
    Price History: "${priceHistory}"
  `,
  ANALYZE_PATTERNS: (trades: string) => `
    Analyze this batch of recent trades for recurring patterns and behavioral issues.
    Output ONLY JSON: { "patterns": ["string"], "issues": ["string"], "fixes": ["string"] }.
    Trades: ${trades}
  `,
  GENERATE_CHECKLIST: (strategyName: string, content: string) => `
    You are an institutional trading assistant. Analyze the following trading strategy: "${strategyName}".
    Content:
    "${content}"
    
    Based on this strategy, generate a concise, mechanical pre-trade checklist.
    Each item must be a clear, actionable rule (e.g., "Check for HTF displacement", "Verify 15m MSS").
    Return ONLY a JSON array of strings: ["Item 1", "Item 2", ...].
    Aim for 5-10 most critical items.
  `,
  PREDICT_CONTENT: (context: string) => `
    You are an AI writing assistant for a high-performance trading platform.
    Based on the following text, predict the next few words or the rest of the sentence to complete it.
    Keep the completion short (max 5-10 words).
    IMPORTANT: Return ONLY the completion text itself. Do not repeat the context. Do not add quotes.
    Context: "${context}"
  `
};
