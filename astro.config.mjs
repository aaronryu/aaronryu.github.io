// @ts-nocheck
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import icon from "astro-icon";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
} from "@shikijs/transformers";
import remarkCodeTitles from "remark-code-titles";
import sitemap from "@astrojs/sitemap";
import fs from "fs";
import path from "path";

// 1. 한국어 포스트의 날짜 데이터를 수집하는 함수 (에러 안전)
function getKoPostDates(baseDir) {
  const dates = {};

  if (!fs.existsSync(baseDir)) return dates;

  // 모든 하위 디렉토리를 재귀적으로 탐색
  const getAllFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllFiles(file));
      } else if (file.match(/\/ko\/.*?\.(md|mdx)$/)) {
        // /ko/ 경로 포함 확인
        results.push(file);
      }
    });
    return results;
  };

  const files = getAllFiles(baseDir);

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    // 정규표현식으로 updated 또는 date 추출 (프론트매터 파싱 에러 방지)
    const updatedMatch = content.match(/updated:\s*([^\n\r]+)/);
    const createdMatch = content.match(/created:\s*([^\n\r]+)/);
    const dateValue = updatedMatch
      ? updatedMatch[1].trim()
      : createdMatch
        ? createdMatch[1].trim()
        : null;

    if (dateValue) {
      const parts = file.split(path.sep);
      const fileName = parts.pop();
      // index.md라면 부모 폴더명을, 아니면 파일명을 슬러그로 사용
      const slug = fileName.startsWith("index") ? parts.pop() : fileName.replace(/\.(md|mdx)$/, "");

      // 참고로 날짜가
      // - 2019-02-27T16:33:44.365Z 이렇게 되어있으면 정상 변환되고
      // - 2019-02-27T16:33:44      이렇게 되어있으면 9시간 빠진 시간으로 변환됨
      dates[slug] = new Date(dateValue).toISOString();
    }
  });
  return dates;
}

const koBlogsPostDates = getKoPostDates("./blog");
const koHobbyPostDates = getKoPostDates("./hobby");
const koPostDates = { ...koBlogsPostDates, ...koHobbyPostDates };

const SITE_ORIGIN = "https://aaronryu.netlify.app";
// https://astro.build/config
export default defineConfig({
  // (A) Astro-specific options
  // site: 'https://aaronryu.github.io', - Sitemap / Canonocal 생성하여 SEO 가속
  site: SITE_ORIGIN,
  trailingSlash: "never",

  // (B) Vite-specific options
  // vite: { ... },
  integrations: [
    preact(),
    icon(),
    sitemap({
      i18n: {
        defaultLocale: "ko",
        locales: {
          ko: "ko", // "ko-KR",
          en: "en", // "en-US",
          ja: "ja", // "ja-JP",
        },
      },
      serialize(item) {
        const urlPath = item.url.replace(/\/$/, "");
        const slug = urlPath.split("/").pop();

        // 루트 URL 사이트맵에서 제거
        const isRoot = urlPath === "https://aaronryu.netlify.app";
        if (isRoot) return null;

        if (item.url.includes("/posts/") && koPostDates[slug]) {
          item.lastmod = koPostDates[slug];
          // item.changefreq = "monthly";
          // item.priority = 0.8;
        } else {
          delete item.lastmod;
          // item.changefreq = "weekly";
          // item.priority = 0.5;
        }

        // i18n 및 x-default 처리
        if (item.links) {
          item.links = item.links.map((l) => ({ ...l, lang: l.lang.split("-")[0] }));

          const koLink = item.links.find((l) => l.url.includes("/ko/") || l.url.endsWith("/ko"));
          if (koLink) {
            item.links = item.links.map((l) => (l.lang === "ko" ? { ...l, url: koLink.url } : l));
            if (!item.links.some((l) => l.lang === "x-default")) {
              item.links.push({ lang: "x-default", url: koLink.url });
            }
          }

          const seen = new Set();
          item.links = item.links.filter((l) => !seen.has(l.lang) && seen.add(l.lang));
        }
        return item;
      },
    }),
  ],

  // (C) 다국어 설정 - 본 블로그는 무조건 SSG 로 동작되도록 픽스
  output: "static",
  i18n: {
    defaultLocale: "ko",
    locales: ["ko", "en", "jp"],
    routing: {
      // 기본 언어인 ko도 /ko/ 경로를 사용하게 함 (추천)
      prefixDefaultLocale: true,
    },
  },

  markdown: {
    // 여기서 먼저 타이틀을 div로 변환
    remarkPlugins: [remarkCodeTitles],
    shikiConfig: {
      // 원하는 테마로 변경 (예: 'dracula', 'nord', 'github-dark' 등)
      theme: "dracula",
      // 여러 테마 사용 시 (다크/라이트 모드 대응)
      // themes: {
      //   light: "github-light",
      //   dark: "dracula", // "github-dark",
      // },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
      ],
    },
  },
});
