import { css } from "@emotion/react"
import { Link } from "gatsby"
import * as React from "react"
import { CategoryArticle } from "."
import { CategoryLine, sliceStringWithMax, styles } from "./main-category"

const NestedCategoryArticles: React.FunctionComponent<{ maxTitleLength: number, categories: Array<CategoryArticle> }> = ({ maxTitleLength, categories }) => (
  <React.Fragment>
    {categories.map((each, index) => {
      const subCategory = each.category // .join(' - ')
      const notLastNestedCategory = index < (categories.length - 1)
      return (
        <NestedCategoryBox key={subCategory}>
          <NestedCategoryTitle category={subCategory} articleCount={each.count} />
          <ul css={styles.nestedArticles} key={subCategory}>
            {notLastNestedCategory && <CategoryLine size="nested" top={-21} left={21} plusHeight={44} />}
            {each.articles.map(article => (
              <li css={[styles.article, css`position: relative; left: 24px;`]} key={article.title}>
                <Link css={styles.articleTitle} to={article.link}>
                  {sliceStringWithMax(article.title, maxTitleLength)}
                </Link>
              </li>
            ))}
          </ul>
        </NestedCategoryBox>
      )
    })}
  </React.Fragment>
)

const NestedCategoryBox: React.FunctionComponent<{
  children: React.ReactNode, props?: any
}> = ({ children, props }) => (
  <div css={css`width: calc(100% - 34px); margin: 4px 0 0 auto;`} {...props}>
    {children}
  </div>
)

const NestedCategoryDot = () => (
  <div css={css`
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;
  `}>
    <div css={css`width: 11px;`} />
    <div css={css`
      height: 2px;
      width: 22px;
      background-color: var(--text-link);
    `}/>
  </div>
)

const NestedCategoryTitle: React.FunctionComponent<{
  category: string,
  articleCount: number,
}> = ({ category, articleCount }) => (
  <div css={[styles.subCategoryHeader, css`height: 20px;`]}>
    <NestedCategoryDot />
    <div css={[styles.nestedCategoryHeader, css`padding-left: 10px;`]}>
      <span css={styles.categoryTitle}>{category}</span>
      <div css={css`
        margin: 0 10px;
        height: 2px;
        width: 100%;
        background-color: var(--text-link);
      `} />
      <span css={[styles.categoryTitle, css`margin: 0 10px 0 auto;`]}>{articleCount}</span>
    </div>
  </div>
)

export default NestedCategoryArticles