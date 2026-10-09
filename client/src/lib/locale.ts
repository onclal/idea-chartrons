export type LocaleText = { fr: string; en: string; es?: string };

export function loc(lang: string, text: LocaleText): string {
  const code = lang.toLowerCase();
  if (code.startsWith('en')) return text.en;
  if (code.startsWith('es')) return text.es ?? text.fr;
  return text.fr;
}
