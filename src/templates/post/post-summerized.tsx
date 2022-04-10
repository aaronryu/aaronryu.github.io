import React from 'react'
import { css } from '@emotion/react'
import { Abstract, Epigraph, Header, Meta } from './post-article'
import { ChildImageWithUrl } from '../../hooks/use-nodes-details'

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
  imageAlt?: string
  image?: ChildImageWithUrl
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
  imageAlt,
  image,
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
      imageAlt={imageAlt}
      image={image}
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
    border-radius: 4px;
    
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