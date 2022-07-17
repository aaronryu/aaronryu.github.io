import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import * as React from "react"
import { CategoryArticle } from "."
import SubCategoryArticles from "./sub-category"

export const CategoryLine = styled(`div`)({
  content: '""',
  position: 'absolute',
  width: '2px',
  backgroundColor: 'var(--text-link)',
})

const CategoryMainLine = styled(CategoryLine)({
  left: `14px`,
  top: `-0.2rem`,
  height: `calc(100% + 1.5rem + 0.3rem)`,
  '@media only screen and (max-width: 700px)': {
    top: `0px`,
    height: `calc(100% + 1.5rem)`,
  },
  '@media only screen and (max-width: 600px)': {
    top: `0px`,
    height: `calc(100% + 1.5rem)`,
  },
})

export const sliceStringWithMax = (str: string, max: number) => 
  (str.length >= max)
    ? `${str.slice(0, max)}...`
    : str

const MainCategoryArticles: React.FunctionComponent<{ maxTitleLength: number, categories: Array<CategoryArticle> }> = ({ maxTitleLength, categories }) => (
  <React.Fragment>
    {categories.map(each => {
      const mainCategory = each.category // .join(' - ')
      const hasSubCategory = each.subCategories && (each.subCategories.length > 0)
      return (
        <MainCategoryBox key={mainCategory}>
          <MainCategoryTitle category={mainCategory} articleCount={each.count} />
          <ul css={styles.articles} key={mainCategory}>
            {hasSubCategory && <CategoryMainLine />}
            {each.articles.map(article => (
              <li css={styles.article} key={article.title}>
                <Link css={styles.articleTitle} to={article.link}>
                  {sliceStringWithMax(article.title, maxTitleLength)}
                </Link>
              </li>
            ))}
          </ul>
          {hasSubCategory && <SubCategoryArticles maxTitleLength={maxTitleLength - 3} categories={each.subCategories!} />}
        </MainCategoryBox>
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

export const styles = {
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
  categoryTitle: css`
    min-width: fit-content;
    font-size: 1.12rem;
    @media only screen and (max-width: 700px) {
      font-size: 1.015rem;
    }
  `,
  subCategoryHeader: css`
    display: flex;
    flex-direction: row;
  `,
  nestedCategoryHeader: css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    font-size: 1.115rem;
    color: var(--text-link);
    border-radius: 5px;

    @media only screen and (max-width: 700px) {
      font-size: 1.015rem;
    }
  `,
  articles: css`
    position: relative;
    top: -0.8rem;
    margin-bottom: -6px;
  `,
  nestedArticles: css`
    position: relative;
    top: -8px;
    margin-bottom: 6px;
  `,
  article: css`
    font-weight: 100;
    font-size: 0.96rem;
    @media only screen and (max-width: 700px) {
      font-size: 0.90rem;
    }
  `,
  articleTitle: css`
    display: flex;
    color: var(--text);
  `,
}

export default MainCategoryArticles