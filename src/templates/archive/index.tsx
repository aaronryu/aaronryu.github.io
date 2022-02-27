import * as React from "react"
import { css } from "@emotion/react"
import MainCategoryArticles from "./main-category"
import { getWindowDimensions } from "../../components/layout"
import { useEffect, useState } from "react"
import { graphql } from "gatsby"

export interface Article {
  title: string,
  link: string,
}

export interface CategoryArticle {
  category: Array<string>
  articles: Array<Article>
  count: number
  subCategories?: Array<CategoryArticle>
}

interface Node {
  node: {
    childMdx: NodeArticle
  }
}

interface NodeArticle {
  id: string 
  slug: string
  frontmatter: {
    title: string /* 제목에 해당합니다. */
    category: string /* js */
    categoryNames: Array<string> /* Javascript */
    date: string /* MMMM D, YYYY */
  }
}
interface Props {
  data: {
    allFile: {
      edges: Array<Node>
    }
  }
}

const categories: Array<CategoryArticle> = [
  {
    category: [ 'Frontend', 'Javascript' ], // 메뉴리스트에서 보여지는것은 대/중분류
    articles: [
      { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
      { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
      { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
      { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
      { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
    ],
    count: 12,
    subCategories: [
      {
        category: [ 'Engine', 'React' ],
        articles: [
          { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
          { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
          { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
        ],
        count: 6,
        subCategories: [
          {
            category: [ 'Typescript', 'Semantic' ],
            articles: [
              { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
              { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
            ],
            count: 2,
          },
          {
            category: [ 'Typescript', 'Algorithm' ],
            articles: [
              { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure 그리고 삼겹살을 맛있게 먹는방법', link: '/js/hosting' },
              { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
            ],
            count: 2,
          },
        ]
      },
      {
        category: [ 'Code Styles', 'Styling' ],
        articles: [
          { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure 그리고 삼겹살을 맛있게 먹는방법', link: '/js/hosting' },
          { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
        ],
        count: 4,
        subCategories: [
          {
            category: [ 'SASS', 'Logic' ],
            articles: [
              { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure 그리고 삼겹살을 맛있게 먹는방법', link: '/js/hosting' },
              { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
            ],
            count: 2,
          },
        ]
      },
    ]
  },
  {
    category: [ 'Frontend', 'Javascript' ], // 메뉴리스트에서 보여지는것은 대/중분류
    articles: [
      { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure 그리고 삼겹살을 맛있게 먹는방법', link: '/js/hosting' },
      { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
    ],
    count: 2,
  },
  {
    category: [ 'Frontend', 'Javascript' ], // 메뉴리스트에서 보여지는것은 대/중분류
    articles: [
      { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure 그리고 삼겹살을 맛있게 먹는방법', link: '/js/hosting' },
      { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
    ],
    count: 6,
    subCategories: [
      {
        category: [ 'Engine', 'React' ],
        articles: [
          { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure 그리고 삼겹살을 맛있게 먹는방법', link: '/js/hosting' },
          { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
        ],
        count: 4,
        subCategories: [
          {
            category: [ 'Typescript', 'Semantic' ],
            articles: [
              { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure 그리고 삼겹살을 맛있게 먹는방법', link: '/js/hosting' },
              { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
            ],
            count: 2,
          },
        ]
      },
    ]
  }
]

const sortingCategorizing = (edges: Array<Node>) => {
  const categoryMap = {}
  edges.forEach(edge => {
    const categories = edge.node.childMdx.frontmatter.categoryNames
    const totalCategories = categories.length
    const article = edge.node.childMdx
    // console.log(Object.keys(categoryMap))
    searchAndAppendCategory(0, categories, categoryMap, article)
  })
  // console.log(JSON.stringify(categoryMap))

  return categoryMap
}

const searchAndAppendCategory = (index: number, categories: Array<string>, categoryMap: any, article: NodeArticle) => {
  const totalCategory = categories.length
  const currentCategory = categories[index]

  let done = false;
  for (let writtenCategory of Object.keys(categoryMap)) {
    const writtenCategoryMap = categoryMap[writtenCategory]
    if (writtenCategory === currentCategory) {
      // * 존재
      if ((index + 1) < totalCategory) {
        searchAndAppendCategory(index + 1, categories, writtenCategoryMap.sub, article)
        done = true
      } else {
        writtenCategoryMap.link = `/${article.frontmatter.category}`
        writtenCategoryMap.list.push(article)
        return
      }
    }
  }
  if (!done) {
    // * 비존재
    if ((index + 1) < totalCategory) {
      categoryMap[currentCategory] = createNewCategory()
      categoryMap[currentCategory].link = `/${article.frontmatter.category}`
      categoryMap[currentCategory].list.push(article)
      searchAndAppendCategory(index + 1, categories, categoryMap[currentCategory].sub, article)
    } else {
      categoryMap[currentCategory] = createNewCategory()
      categoryMap[currentCategory].link = `/${article.frontmatter.category}`
      categoryMap[currentCategory].list.push(article)
      return
    }
  }
}

const createNewCategory = () => {
  return { link: '/', sub: {}, list: [] }
}

const calculateMaxArticleTitleLength = (width : number) => {
  if (width <= 500) {
    return 42
  } else if (width <= 600) {
    return 48
  } else if (width <= 700) {
    return 57
  } else if (width <= 800) {
    return 60
  } else if (width <= 800) {
    return 62
  } else if (width <= 900) {
    return 64
  } else {
    return 80
  }
}

const ArchiveTemplate: React.FunctionComponent<Props> = ({ data: { allFile: { edges } }}) => {
  console.log(edges)
  console.log(sortingCategorizing(edges))
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  const [maxArticleTitleLength, setMaxArticleTitleLength] = useState(calculateMaxArticleTitleLength(windowDimensions.width))

  useEffect(() => {
    let mounted = true;
    window.addEventListener('resize', () => {
      if (mounted) {
        const current = getWindowDimensions()
        setWindowDimensions(current)
        setMaxArticleTitleLength(calculateMaxArticleTitleLength(current.width))
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <article>
      <div css={styles.body}>
        <MainCategoryArticles maxTitleLength={maxArticleTitleLength} categories={categories} />
      </div>
    </article>
  )
}

const styles = {
  body: css`
    margin: 4rem auto 2rem;
    padding: 0 1rem;
    width: 100%;
    max-width: 900px;
    line-height: 2;
    font-size: 1.0rem;

    @media only screen and (max-width: 700px) {
      padding: 0;
      font-size: 0.84rem;
    }

    p,
    ul,
    ol {
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-all;
      word-break: break-word;
      hyphens: auto;
    }

    ul,
    ol {
      padding-left: 4rem;
      @media only screen and (max-width: 700px) {
        padding-left: 3rem;
      }

      ul,
      ol {
        margin-bottom: 0;
      }
    }

    blockquote {
      margin-left: 2.1rem;
      margin-right: 0;
      font-size: 0.9rem;
    }

    img {
      max-width: 100%;
    }

    hr {
      position: relative;
      margin: 2.848rem auto 2.848rem;
      padding: 0;
      border: none;
      width: 20px;
      height: 20px;
      background: none;

      &::after {
        content: '\u2666';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    h1,
    h2 {
      // margin: 1.6rem 0 0 0;
      margin: 2.3rem 0 0 0;
      @media only screen and (max-width: 700px) {
        margin: 2rem 0 1rem 0;
      }
      line-height: 1.6;
      font-weight: 400;
      scroll-margin-top: 5rem;
    }

    h2 {
      font-size: 1.296rem;
      font-weight: 600;
      height: 2.3rem;
      border-bottom: 2px solid var(--text-link);
      @media only screen and (max-width: 700px) {
        font-size: 1.196rem;
      }
    }

    h3 {
      font-size: 1.115rem;
      @media only screen and (max-width: 700px) {
        font-size: 1.015rem;
      }
    }

    h4 {
      font-size: 1.138rem;
      @media only screen and (max-width: 700px) {
        font-size: 1.038rem;
      }
    }

    h5 {
      font-size: 1.067rem;
      @media only screen and (max-width: 700px) {
        font-size: 0.967rem;
      }
    }

    small {
      font-size: 0.937rem;
      @media only screen and (max-width: 700px) {
        font-size: 0.837rem;
      }
    }

    .gatsby-highlight {
      margin-bottom: 1.602rem;
    }

    [data-language] {
      ::before {
        content: attr(data-language);
        display: flex;
        justify-content: flex-end;
        margin-right: 0.8rem;
        margin-bottom: -2rem;
        letter-spacing: 0.05rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--text-placeholder);
      }
    }

    .gatsby-code-title {
      margin-left: 0.2rem;
      margin-bottom: 0.5rem;
      text-align: left;
      font-size: 0.8rem;
      font-family: 'Fira Code', 'Consolas', 'Menlo', 'Monaco', 'Andale Mono WT',
        'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter',
        'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono',
        'Nimbus Mono L', 'Courier New', 'Courier', monospace;
      color: var(--text-auxiliary);
    }
  `,
}


export const query = graphql`
  query($nodeCategory: String!, $nodePath: String!) {
    allFile(
      filter: {
        sourceInstanceName: { eq: $nodeCategory }
        extension: { eq: "mdx" }
        childMdx: { frontmatter: { category: { eq: $nodePath } } }
      }
    ) {
      edges {
        node {
          childMdx {
            id
            slug
            frontmatter {
              date(formatString: "MMMM D, YYYY")
              title
              category
              categoryNames
            }
          }
        }
      }
    }
  }
`

export default ArchiveTemplate
