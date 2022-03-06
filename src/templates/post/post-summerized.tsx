import React from 'react'
import { css } from '@emotion/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import { Abstract, Epigraph, Header, Meta } from './post-article'

export interface GatsbyImageSharpFluidWithWebp {
  aspectRatio: number
  base64: string
  sizes: string
  src: string
  srcSet: string
  srcSetWebp: string
  srcWebp: string
}

export interface ChildImage {
  childImageSharp: {
    gatsbyImageData: IGatsbyImageData
  }
};

export interface ArticleSummerizedProps {
  categories: Array<string>
  headline: string
  date: string
  dateFormatted: string
  deck?: string
  abstract?: string
  epigraph?: string
  epigraphAuthor?: string
  articleUrl: string
  categoryUrl: string
}

const ArticleSummerized: React.FunctionComponent<ArticleSummerizedProps> = ({
  categories,
  headline,
  deck,
  abstract,
  epigraph,
  epigraphAuthor,
  date,
  dateFormatted,
  articleUrl,
  categoryUrl,
}) => (
  <article css={styles.wrapper}>
    <Header
      categories={categories}
      headline={headline}
      deck={deck}
      date={date}
      dateFormatted={dateFormatted}
      articleUrl={articleUrl}
      categoryUrl={categoryUrl}
      summerized
    />
    <Abstract text={abstract} summerized />
    <Epigraph text={epigraph} author={epigraphAuthor} summerized />
  </article>
)

const styles = {
  wrapper: css`
    border: 1.5px solid var(--text-link);
    margin: 0 auto 2rem;
    border-radius: 10px;
    padding: 1.4rem 0 0.4rem 0.4rem;
    
    max-width: calc(800px + 1rem);
  `,
  headerSizer: css`
    @media only screen and (max-width: 1280px) {
      margin: 0 auto 0 50px;
      padding: 0 1.2rem;
    }
    @media only screen and (max-width: 1024px) {
      margin: 0 auto 0 0;
      padding: 0 1.2rem;
    }
    @media only screen and (max-width: 970px) {
      margin: 0 auto;
      padding: 0 1.2rem;
    }
  `,
}

export default ArticleSummerized