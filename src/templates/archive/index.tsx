import { css } from "@emotion/react"
import styled from "@emotion/styled"
import * as React from "react"

const Highlight = styled('a')(() => ({
  fontWeight: 'bold',
  color: 'var(--text-link)',
}))

interface Article {
  title: string,
  link: string,
}

interface CategoryArticle {
  category: Array<string>
  articles: Array<Article>
  count: number
  subCategories?: Array<CategoryArticle>
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
              { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
              { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
            ],
            count: 2,
          },
        ]
      },
      {
        category: [ 'Code Styles', 'Styling' ],
        articles: [
          { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
          { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
        ],
        count: 4,
        subCategories: [
          {
            category: [ 'SASS', 'Logic' ],
            articles: [
              { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
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
      { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
      { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
    ],
    count: 2,
  },
  {
    category: [ 'Frontend', 'Javascript' ], // 메뉴리스트에서 보여지는것은 대/중분류
    articles: [
      { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
      { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
    ],
    count: 6,
    subCategories: [
      {
        category: [ 'Engine', 'React' ],
        articles: [
          { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
          { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
        ],
        count: 4,
        subCategories: [
          {
            category: [ 'Typescript', 'Semantic' ],
            articles: [
              { title: 'Javascript 엔진 개요 및 실행 과정으로 살펴보는 Hoisting 과 Closure', link: '/js/hosting' },
              { title: '[React] useState 와 useEffect 의 사용', link: '/js/usestate-and-useeffect' },
            ],
            count: 2,
          },
        ]
      },
    ]
  }
]

const ArchiveTemplate: React.FunctionComponent<{}> = ({}) => {
  return (
    <article>
      <div css={styles.body}>
        <MainCategoryArticles categories={categories} />
      </div>
    </article>
  )
}

const MainCategoryLine = styled(`div`)(() => ({
  content: '""',
  position: 'absolute',
  top: '-4px',
  left: '14px',
  height: 'calc(100% + 50px)',
  width: '2px',
  backgroundColor: 'var(--text-link)'
}))

const MainCategoryArticles: React.FunctionComponent<{ categories: Array<CategoryArticle> }> = ({ categories }) => (
  <React.Fragment>
    {categories.map(each => {
      const mainCategory = each.category.join(' - ')
      const hasSubCategory = each.subCategories && (each.subCategories.length > 0)
      return (
        <MainCategoryBox key={mainCategory}>
          <MainCategoryTitle category={mainCategory} articleCount={each.count} />
          <ul css={styles.articles} key={mainCategory}>
            {hasSubCategory && <MainCategoryLine />}
            {each.articles.map(article => (
              <li css={styles.article} key={article.title}>
                <div css={styles.articleTitle}>
                  {article.title}
                </div>
              </li>
            ))}
          </ul>
          {hasSubCategory && <SubCategoryArticles categories={each.subCategories!} />}
        </MainCategoryBox>
      )
    })}
  </React.Fragment>
)

const SubCategoryLine = styled(`div`)(() => ({
  content: '""',
  position: 'absolute',
  top: '-23px',
  left: '3px',
  height: 'calc(100% + 80px)',
  width: '2px',
  backgroundColor: 'var(--text-link)'
}))

const SubCategoryArticles: React.FunctionComponent<{ categories: Array<CategoryArticle> }> = ({ categories }) => (
  <React.Fragment>
    {categories.map((each, index) => {
      const subCategory = each.category.join(' - ')
      const notLastSubCategory = index < (categories.length - 1)
      return (
        <SubCategoryBox key={subCategory}>
          <SubCategoryTitle category={subCategory} articleCount={each.count} />
          <ul css={styles.articles} key={subCategory}>
            {notLastSubCategory && <SubCategoryLine />}
            {each.articles.map(article => (
              <li css={styles.article} key={article.title}>
                <div css={styles.articleTitle}>
                  {article.title}
                </div>
              </li>
            ))}
          </ul>
        </SubCategoryBox>
      )
    })}
  </React.Fragment>
)

const ChevronRight = () => (
  <a css={css`position: relative; left: -5px`}>
    <svg height="20" viewBox="0 0 18 18" width="24" fill="var(--text-link)">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path>
    </svg>
  </a>
)

const MainCategoryTitle: React.FunctionComponent<{
  category: string,
  articleCount: number,
}> = ({ category, articleCount }) => {
  return (
    <div css={[styles.categoryHeader, css`background-color: var(--text-link-background);`]}>
      <ChevronRight />
      <strong css={styles.categoryTitle}>{category}</strong>
      <span css={[styles.categoryTitle, css`margin: 0 10px 0 auto;`]}>{articleCount}</span>
    </div>
  )
}

const MainCategoryBox: React.FunctionComponent<{
  children: React.ReactNode, props?: any
}> = ({ children, props }) => (
  <div css={[styles.categoryBox, css`margin: 0px 10px 10px;`]} {...props}>
    {children}
  </div>
)

const SubCategoryBox: React.FunctionComponent<{
  children: React.ReactNode, props?: any
}> = ({ children, props }) => (
  <div css={[styles.categoryBox, css`margin: 10px 0 0 0;`]} {...props}>
    {children}
  </div>
)

const SubCategoryDot = () => (
  <div css={css`
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;
    // right: 6px;
  `}>
    <div css={css`
      border-radius: 50%;
      height: 8px;
      width: 8px;
      background-color: var(--text-link);
    `}/>
    <div css={css`
      height: 2px;
      width: 14px;
      background-color: var(--text-link);
    `}/>
  </div>
)

const SubCategoryTitle: React.FunctionComponent<{
  category: string,
  articleCount: number,
}> = ({ category, articleCount }) => (
  <div css={styles.subCategoryHeader}>
    <SubCategoryDot />
    <div css={[styles.categoryHeader, css`border: 1px solid var(--text-link); padding-left: 10px;`]}>
      <strong css={styles.categoryTitle}>{category}</strong>
      <span css={[styles.categoryTitle, css`margin: 0 10px 0 auto;`]}>{articleCount}</span>
    </div>
  </div>
)

const styles = {
  categoryBox: css`
    border: 1px solid var(--text-link);
    border-radius: 10px;
    padding: 10px;
    
    @media only screen and (max-width: 700px) {
      margin: 8px;
    }
  `,
  categoryHeader: css`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    font-size: 1.115rem;
    color: var(--text-link);
    border-radius: 5px;

    @media only screen and (max-width: 700px) {
      font-size: 1.015rem;
    }
  `,
  subCategoryHeader: css`
    display: flex;
    flex-direction: row;
  `,
  categoryTitle: css`
    font-size: 1.12rem;
    @media only screen and (max-width: 700px) {
      font-size: 1.015rem;
    }
  `,
  articles: css`
    position: relative;
    top: -12px;
    margin-bottom: -6px;
  `,
  article: css`
    font-size: 1rem;
    @media only screen and (max-width: 700px) {
      font-size: 0.92rem;
    }
  `,
  articleTitle: css`
    display: flex;
    flex-wrap: wrap;
    color: var(--text-link);
  `,
  body: css`
    margin: 8rem auto 8rem;
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

export default ArchiveTemplate
