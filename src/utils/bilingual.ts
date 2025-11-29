import { Language } from './i18n';

export function parseBilingualText(text: string, language: Language): string {
  if (!text || !text.includes('|')) {
    return text || '';
  }
  
  const parts = text.split('|');
  if (parts.length < 2) {
    return text;
  }
  
  // First part is Spanish, second part is English
  return language === 'es' ? parts[0].trim() : parts[1].trim();
}