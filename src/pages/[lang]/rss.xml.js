import { AARONS_BLOG_DESCRIPTION, AARONS_BLOG_TITLE } from "@/layouts/BaseLayout.astro";
import rss, { pagesGlobToRssItems } from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function getStaticPaths() {
  return [{ params: { lang: "ko" } }, { params: { lang: "en" } }, { params: { lang: "ja" } }];
}

export async function GET(context) {
  const { lang } = context.params;

  const posts = await getCollection("blog", ({ id }) => id.startsWith(`${lang}/`));
  const hobbies = await getCollection("hobby", ({ id }) => id.startsWith(`${lang}/`));
  return rss({
    title: AARONS_BLOG_TITLE,
    description: AARONS_BLOG_DESCRIPTION[lang],
    site: context.site,
    // items: await pagesGlobToRssItems(import.meta.glob("@/pages/**/*.md")),
    items: [
      ...posts.map((post) => ({
        link: `/${lang}/posts/${post.slug}`,
        content: sanitizeHtml(parser.render(post.body)), // 전체 콘텐츠 렌더링
        customData: `<category>${post.filePath?.split("/").slice(1, -1)[0]}/${post.data.category
          .map((each) => each.toLowerCase().replace(",", "").replace(" ", "-"))
          .join("/")}</category>`,
        ...post.data,
      })),
      ...hobbies.map((hobby) => ({
        link: `/${lang}/hobby/${hobby.slug}`,
        content: sanitizeHtml(parser.render(hobby.body)), // 전체 콘텐츠 렌더링
        customData: `<category>${hobby.data.category
          .map((each) => each.toLowerCase().replace(",", "").replace(" ", "-"))
          .join("/")}</category>`,
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
