import { AARONS_BLOG_DESCRIPTION, AARONS_BLOG_TITLE } from "@/layouts/BaseLayout.astro";
import rss, { pagesGlobToRssItems } from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SUPPORTED_LANGUAGES, wipeoutPath } from "@/scripts/i18n";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();

export async function getStaticPaths() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ params: { lang } }));
}

export async function GET(context) {
  const { lang } = context.params;

  const posts = await getCollection("blog", ({ id }) => id.includes(`/${lang}/`));
  const hobbies = await getCollection("hobby", ({ id }) => id.includes(`/${lang}/`));
  return rss({
    // Option
    trailingSlash: false,
    // Data
    title: AARONS_BLOG_TITLE,
    description: AARONS_BLOG_DESCRIPTION[lang],
    site: context.site,
    // items: await pagesGlobToRssItems(import.meta.glob("@/pages/**/*.md")),
    items: [
      ...posts.map((post) => ({
        link: `/${lang}/posts/${wipeoutPath(post.id)}`,
        content: sanitizeHtml(parser.render(post.body)), // 전체 콘텐츠 렌더링
        customData: [
          ...new Set([
            ((str) => str.charAt(0).toUpperCase() + str.slice(1))(
              post.filePath?.split("/").slice(1, -1)[0],
            ),
            ...post.data.category,
          ]),
        ]
          .map((each) => `<category>${each}</category>`)
          .join(""),
        ...post.data,
      })),
      ...hobbies.map((hobby) => ({
        link: `/${lang}/hobby/${wipeoutPath(hobby.id)}`,
        content: sanitizeHtml(parser.render(hobby.body)), // 전체 콘텐츠 렌더링
        customData: [
          ...new Set([
            ((str) => str.charAt(0).toUpperCase() + str.slice(1))(
              post.filePath?.split("/").slice(1, -1)[0],
            ),
            ...hobby.data.category,
          ]),
        ]
          .map((each) => `<category>${each}</category>`)
          .join(""),
        ...hobby.data,
      })),
    ],
    customData: (() => {
      switch (lang) {
        case "ko":
          return "<language>ko-kr</language>";
        case "en":
          return "<language>en-us</language>";
        case "ja":
          return "<language>ja-jp</language>";
      }
    })(),
  });
}
