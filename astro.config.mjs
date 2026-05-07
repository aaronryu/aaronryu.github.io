// @ts-check
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

// https://astro.build/config
export default defineConfig({
  // (A) Astro-specific options
  // site: 'https://aaronryu.github.io', - Sitemap / Canonocal 생성하여 SEO 가속
  site: "https://aaronryu.netlify.app",

  // (B) Vite-specific options
  // vite: { ... },
  integrations: [
    preact(),
    icon(),
    sitemap({
      i18n: {
        defaultLocale: "ko",
        locales: {
          ko: "ko-KR",
          en: "en-US",
          ja: "ja-JP",
        },
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
