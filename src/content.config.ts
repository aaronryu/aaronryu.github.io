// glob 로더 가져오기
import { glob } from "astro/loaders";
// `astro:content`에서 유틸리티 가져오기
import { defineCollection } from "astro:content";
// Zod 가져오기
import { z } from "astro/zod";
// 각 컬렉션에 대한 `loader` 및 `schema` 정의
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./blog" }),
  schema: z.object({
    title: z.string(),
    category: z.array(z.string()).min(1), // 태그의 역할도 겸하지만 최상위 태그 기준으로 글을 관심사별로 정리하여 조회할 수 있도록
    created: z.date(),
    updated: z.date().optional(),
    deck: z.string(),
    abstract: z.string(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
  }),
});
// 단일 `collections` 객체를 내보내 컬렉션을 등록하세요
export const collections = { blog };
