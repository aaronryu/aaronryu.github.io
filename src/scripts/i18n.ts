export function useTranslatedPath(lang: string) {
  return function translatePath(path: string) {
    return `/${lang}${path.startsWith("/") ? path : "/" + path}`;
  };
}
