import type { CollectionEntry } from "astro:content";

export const SUPPORTED_LANGUAGES = ["ko", "en", "ja"] as const;
export type Lang = (typeof SUPPORTED_LANGUAGES)[number];

// 마크다운 파일이 어떤 언어의 디렉토리에 포함되어있는지
export function extractI18nFromPost(post: CollectionEntry<"blog" | "hobby">): Lang {
  const [lang, ..._] = post.id.split("/");
  return lang as Lang;
}

// (A) /pages/[lang]/ 하위 디렉토리에 존재하는 모든 페이지에 대해 ko, en, ja 각각마다의 페이지 생성 SSG 을 위해 필요
export async function getI18nStaticPaths(callback: (lang: Lang) => Promise<any>) {
  const allPaths = await Promise.all(
    SUPPORTED_LANGUAGES.map(async (lang) => {
      // 각 언어별로 실행될 로직을 콜백으로 받음
      return await callback(lang);
    }),
  );

  return allPaths.flat();
}

// (B) 어떤 페이지에서도 다른 페이지로 이동하는 href 링크에 현재 유저가 보고있는 언어(파라미터로 입력받음)에 따라 이동하도록 설정
export function useTranslatedPath(lang: string) {
  return function translatePath(path: string) {
    return `/${lang}${path.startsWith("/") ? path : "/" + path}`;
  };
}

export function changeLanguageOnPathname(pathname: string) {
  const langPattern = SUPPORTED_LANGUAGES.join("|");
  const langRegex = new RegExp(`^\\/(${langPattern})`);
  const cleanPath = pathname.replace(langRegex, "");
  // const cleanPath = pathname.replace(/^\/(ko|en|ja)/, "");
  return {
    ko: `/ko${cleanPath}`,
    en: `/en${cleanPath}`,
    ja: `/ja${cleanPath}`,
  };
}
