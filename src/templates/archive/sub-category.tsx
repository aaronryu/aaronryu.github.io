import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import * as React from "react"
import { CategoryArticle } from "."
import { CategoryLine, CategoryMainConnectedSubLine, CategorySubLine, sliceStringWithMax, styles } from "./main-category"
import NestedCategoryArticles from "./nested-category"

const SubCategoryArticles: React.FunctionComponent<{ maxTitleLength: number, categories: Array<CategoryArticle> }> = ({ maxTitleLength, categories }) => (
  <React.Fragment>
    {categories.map((each, index) => {
      const subCategory = each.category // .join(' - ')
      const notLastSubCategory = index < (categories.length - 1)
      const hasNestedCategory = each.subCategories && (each.subCategories.length > 0)
      let nestedHeightCorrection = 0;
      if (each.subCategories) {
        const numOfSubCategories = each.subCategories.length
        const numOfSubArticles = each.subCategories.map(eachSubCategory =>
          eachSubCategory.articles.length
        ).reduce((accumulator, curr) => accumulator + curr, 0)
        nestedHeightCorrection += numOfSubCategories * 36
        nestedHeightCorrection += numOfSubArticles * 31
      }
      return (
        <SubCategoryBox key={subCategory}>
          <SubCategoryTitle category={subCategory} articleCount={each.count} />
          <ul css={styles.articles} key={subCategory}>
            {hasNestedCategory && <CategorySubLine />}
            {notLastSubCategory && <CategoryMainConnectedSubLine />}
            {each.articles.map(article => (
              <li css={[styles.article, css`position: relative; left: 40px;`]} key={article.title}>
                <Link css={styles.articleTitle} to={article.link}>
                  {sliceStringWithMax(article.title, maxTitleLength)}
                </Link>
              </li>
            ))}
          </ul>
          {hasNestedCategory && <NestedCategoryArticles maxTitleLength={maxTitleLength - 3} categories={each.subCategories!} />}
        </SubCategoryBox>
      )
    })}
  </React.Fragment>
)

const SubCategoryBox: React.FunctionComponent<{
  children: React.ReactNode, props?: any
}> = ({ children, props }) => (
  <div {...props}>
    {children}
  </div>
)

const SubCategoryDot = () => (
  <div css={css`
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;
  `}>
    <div css={css`width: 11px;`} />
    <div css={css`
      border-radius: 50%;
      height: 8px;
      width: 8px;
      background-color: var(--text-link);
    `}/>
    <div css={css`
      height: 2px;
      width: 18px;
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

export default SubCategoryArticles