import { AARONS_BLOG_DESCRIPTION, AARONS_BLOG_TITLE } from "@/layouts/BaseLayout.astro";
import rss, { pagesGlobToRssItems } from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: AARONS_BLOG_TITLE,
    description: AARONS_BLOG_DESCRIPTION,
    site: context.site,
    // items: await pagesGlobToRssItems(import.meta.glob("@/pages/**/*.md")),
    items: posts.map((post) => ({
      link: `/posts/${post.slug}`,
      content: sanitizeHtml(parser.render(post.body)), // 전체 콘텐츠 렌더링
      customData: `<category>${post.filePath?.split("/").slice(1, -1)[0]}/${post.data.category
        .map((each) => each.toLowerCase().replace(",", "").replace(" ", "-"))
        .join("/")}</category>`,
      ...post.data,
    })),
    customData: `<language>ko-kr</language>`,
  });
}
