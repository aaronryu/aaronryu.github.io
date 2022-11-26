import React from 'react'
import { css } from '@emotion/react'
import { Abstract, Epigraph, Header, Meta } from './post-article'
import { ChildImageWithUrl } from '../../hooks/use-nodes-details'
import { Link } from 'gatsby'

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
    <ReadMoreButton link={articleUrl} />
  </article>
)

export const ReadMoreButton = ({ link }: { link: string }) => 
  <div style={{ display: 'block', position: 'relative', height: '4em' }}>
    <Link to={link} css={styles.button}>
        Read more
    </Link>
  </div>

const styles = {
  wrapper: css`
    border: 1.5px solid var(--text-link);
    box-shadow: 0 4px 10px rgb(0 0 0 / 50%), 0 0 1px rgb(0 0 0 / 80%);
    margin: 0 auto 2rem;
    border-radius: 4px;
    
    max-width: 800px;
  `,
  button: css`
    position: absolute;
    right: 1em;
    bottom: 1.2em;

    display: inline-block;
    background-color: var(--text-link-background);
    border-radius: 2px;
    text-align: center;

    padding-bottom: calc(0.375em - 1px);
    padding-left: 2em;
    padding-right: 2em;
    padding-top: calc(0.375em - 1px);
  `,
}

export default ArticleSummerized