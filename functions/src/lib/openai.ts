import OpenAI from 'openai';

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada.');
  return new OpenAI({ apiKey });
}

export function getAiModel() {
  return process.env.AI_MODEL ?? 'gpt-4.1-mini';
}
