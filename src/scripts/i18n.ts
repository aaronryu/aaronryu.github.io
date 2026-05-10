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
    // About 페이지 내 자기소개란
    "about.quote": '"Cool Heads, Warm Hearts"',
    "about.quote.description": "날카롭게 사실을 분석하되, 온화하게 세상을 이끌어라",
    "about.name": "Aaron Ryu",
    "about.jobtitle": "Web Application Developer",
    "about.email": "aaron.ryu.dev@gmail.com",
    "about.phone": "+82 10 5549 7201",
    "about.address": "Seoul, 05328, Republic of Korea",
    "about.explain.study": "세상 모든것들에 관심이 많습니다",
    "about.explain.study.sub":
      "무엇인가 새로운것을 배우는걸 매우 좋아합니다\n지식앞에선 아이같습니다",
    "about.explain.mountain": "가만히 앉아 생각하거나 산속에서 유유자적하고 글을 씁니다",
    "about.explain.mountain.sub":
      "어렸을적부터 인문학과 토론을 접해와서\n다양한 주제에 대해 이야기하는걸 좋아합니다",
    "about.explain.humanity": "마주하는 모든 이들이 원하는것들을 이루어가길 바랍니다",
    "about.explain.humanity.sub":
      "타인에게 대가없이 도움을 줄 수 있을만큼의\n여유를 가진 어른이 되길 바랍니다",
  },
  en: {
    "post.created": "Created",
    "post.updated": "Updated",
    "post.related-post": "More in this category",
    "post.recently-post": "Recent posts",
    "post.not-exists": "No posts found yet",
    "post.rss-guidance": "Subscribe to our RSS feed to stay updated with new posts",
    "rss.copied": "RSS feed URL copied. Please add it to your reader (like Feedly) 🙂",
    // About 페이지 내 자기소개란
    "about.quote": '"Cool Heads, Warm Hearts"',
    "about.quote.description": "Analyze facts sharply, lead the world gently",
    "about.name": "Aaron Ryu",
    "about.jobtitle": "Web Application Developer",
    "about.email": "aaron.ryu.dev@gmail.com",
    "about.phone": "+82 10 5549 7201",
    "about.address": "Seoul, 05328, Republic of Korea",
    "about.explain.study": "I am curious about everything in the world",
    "about.explain.study.sub": "I love learning new things;\nI am like a child before knowledge",
    "about.explain.mountain":
      "Sitting quietly in thought,\nenjoying the mountains and writing in leisure",
    "about.explain.mountain.sub":
      "Having been exposed to humanities and\ndebate since childhood, I enjoy discussing a wide range of topics",
    "about.explain.humanity": "I hope everyone I meet achieves what they desire",
    "about.explain.humanity.sub":
      "I aspire to be an adult with enough capacity\nto help others without expecting anything in return",
  },
  ja: {
    "post.created": "作成日",
    "post.updated": "更新日",
    "post.related-post": "同じカテゴリーの関連記事",
    "post.recently-post": "最新記事",
    "post.not-exists": "まだ投稿された記事がありません",
    "post.rss-guidance": "新しい記事をいち早くチェックするために、RSSを登録してみてください",
    "rss.copied": "RSS URLがコピーされました。リーダー(Feedlyなど)に追加してください 🙂",
    // About 페이지 내 자기소개란
    "about.quote": '"Cool Heads, Warm Hearts"',
    "about.quote.description": "鋭く事実を分析し、温かく世界を導く",
    "about.name": "Aaron Ryu",
    "about.jobtitle": "Web Application Developer",
    "about.email": "aaron.ryu.dev@gmail.com",
    "about.phone": "+82 10 5549 7201",
    "about.address": "Seoul, 05328, Republic of Korea",
    "about.explain.study": "世の中のあらゆることに興味があります",
    "about.explain.study.sub":
      "新しいことを学ぶのが大好きです。\n知識の前では子供のようでありたいです",
    "about.explain.mountain": "静かに座って物思いにふけったり\n山の中で悠々自適に執筆したりします",
    "about.explain.mountain.sub":
      "幼い頃から人文学や討論に親しんできたため、\n様々なテーマについて語り合うのが好きです",
    "about.explain.humanity": "出会うすべての人々が、願いを叶えられるよう願っています",
    "about.explain.humanity.sub":
      "見返りを求めず他人に手を差し伸べられるような、\n心の余裕を持った大人になりたいです",
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[Lang]) {
    return ui[lang][key] || ui[DEFAULT_LANGUAGE][key];
  };
}
