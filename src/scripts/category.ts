import { getCollection, type CollectionEntry } from "astro:content";

export type CategoryTree = Array<CategoryNode>;
export interface CategoryNode {
  category: string;
  count: number;
  posts: Array<CollectionEntry<"blog" | "hobby">>;
  subcategory: CategoryTree;
}

export async function getCategoryTree(): Promise<CategoryTree> {
  // const allPosts = Object.values(import.meta.glob("@/pages/posts/*.md", { eager: true }));
  const blogs = await getCollection("blog");
  const hobbies = await getCollection("hobby");
  const posts = [...blogs, ...hobbies];

  return posts.reduce((tree: CategoryTree, post: CollectionEntry<"blog" | "hobby">) => {
    const categories = post.data.category;

    if (!categories || !Array.isArray(categories)) return tree;

    let currentTree = tree;

    categories.forEach((category, index) => {
      // 현재 레벨에서 같은 이름의 카테고리가 있는지 확인
      let existingCategory = currentTree.find((node) => node.category === category);

      // (A) 존재하는 / 존재하지않으면 새로 생성한 카테고리
      if (!existingCategory) {
        // 존재하지 않으면 새로 생성
        existingCategory = {
          category: category,
          count: 0,
          posts: [],
          subcategory: [],
        };
        currentTree.push(existingCategory);
      }

      // (B) 카테고리 내 Post 글 추가하는 단계 - 무조건 1 카운트 추가하고 시작
      existingCategory.count += 1;
      // (B.1) 가장 마지막 카테고리일때만 Post 포스트를 추가
      const isLast = index === categories.length - 1;
      if (isLast) {
        existingCategory.posts.push(post);
      }

      // 다음 순회에서는 현재 카테고리의 subcategory 배열을 타겟으로 설정
      currentTree = existingCategory.subcategory;
    });

    return tree;
  }, []);
}
