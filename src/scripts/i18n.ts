import type { CollectionEntry } from "astro:content";

export const SUPPORTED_LANGUAGES = ["ko", "en", "ja"] as const;
export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0];
export type Lang = (typeof SUPPORTED_LANGUAGES)[number];

const langPattern = SUPPORTED_LANGUAGES.join("|");

// 마크다운 파일이 어떤 언어의 디렉토리에 포함되어있는지
export function extractI18nFromPost(post: CollectionEntry<"blog" | "hobby">): Lang | undefined {
  return post.filePath
    ?.split("/")
    .find((segment) => (SUPPORTED_LANGUAGES as readonly string[]).includes(segment)) as Lang;
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

export function wipeoutPath(path?: string) {
  const langRegex = new RegExp(`\\/(${langPattern})\\/`, "g");
  const wipeoutpath = path?.replace(langRegex, "/");
  return wipeoutpath;
}

// (B) 어떤 페이지에서도 다른 페이지로 이동하는 href 링크에 현재 유저가 보고있는 언어(파라미터로 입력받음)에 따라 이동하도록 설정
export function useTranslatedPath(lang: string) {
  return function translatePath(path: string) {
    const wipeoutpath = wipeoutPath(path);
    return `/${lang}${wipeoutpath}`;
  };
}

export function changeLanguageOnPathname(pathname: string) {
  const langRegex = new RegExp(`^\\/(${langPattern})`);
  const cleanPath = pathname.replace(langRegex, "");
  // const cleanPath = pathname.replace(/^\/(ko|en|ja)/, "");
  return {
    ko: `/ko${cleanPath}`,
    en: `/en${cleanPath}`,
    ja: `/ja${cleanPath}`,
  };
}

// 다양한 언어들을 등록하여 사용
export const ui = {
  ko: {
    "post.created": "생성일",
    "post.updated": "수정일",
    "post.related-post": "같은 카테고리 내 다른 글들",
    "post.recently-post": "최근에 게시된 글들",
    "post.not-exists": "아직 작성된 글이 없습니다",
    "post.rss-guidance": "새 글이 올라왔을때 알 수 있게 RSS 등록을 해보세요",
    "rss.copied": "RSS 주소가 복사되었습니다. 구독기(Feedly 등)에 추가해주세요 🙂",
  },
  en: {
    "post.created": "Created",
    "post.updated": "Updated",
    "post.related-post": "More in this category",
    "post.recently-post": "Recent posts",
    "post.not-exists": "No posts found yet",
    "post.rss-guidance": "Subscribe to our RSS feed to stay updated with new posts",
    "rss.copied": "RSS feed URL copied. Please add it to your reader (like Feedly) 🙂",
  },
  ja: {
    "post.created": "作成日",
    "post.updated": "更新日",
    "post.related-post": "同じカテゴリーの関連記事",
    "post.recently-post": "最新記事",
    "post.not-exists": "まだ投稿された記事がありません",
    "post.rss-guidance": "新しい記事をいち早くチェックするために、RSSを登録してみてください",
    "rss.copied": "RSS URLがコピーされました。リーダー(Feedlyなど)に追加してください 🙂",
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[Lang]) {
    return ui[lang][key] || ui[DEFAULT_LANGUAGE][key];
  };
}
