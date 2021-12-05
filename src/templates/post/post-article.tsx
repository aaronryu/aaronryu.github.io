import React from 'react'
import { css } from '@emotion/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

export interface GatsbyImageSharpFluidWithWebp {
  aspectRatio: number
  base64: string
  sizes: string
  src: string
  srcSet: string
  srcSetWebp: string
  srcWebp: string
}

export interface ArticleProps {
  siteUrl: string
  slug: string
  category: string
  headline: string
  body: string
  date: string
  dateFormatted: string
  image: {
    childImageSharp: {
      fluid: GatsbyImageSharpFluidWithWebp
    }
  }
  deck?: string
  abstract?: string
  epigraph?: string
  epigraphAuthor?: string
  imageAlt?: string
  hideHeroImage?: boolean
}

const Article: React.FunctionComponent<ArticleProps> = ({
  siteUrl,
  slug,
  category,
  headline,
  deck,
  abstract,
  epigraph,
  epigraphAuthor,
  image,
  imageAlt,
  hideHeroImage,
  body,
  date,
  dateFormatted,
}) => (
  <article>
    <div css={styles.headerWrapper}>
      <Header category={category} headline={headline} deck={deck} />
      <Abstract text={abstract} />
    </div>
    <Epigraph text={epigraph} author={epigraphAuthor} />
    <Meta date={date} dateFormatted={dateFormatted} />
    <Body body={body} />
    <Footer />
  </article>
)

const Header: React.FunctionComponent<{
  category: string
  headline: string
  deck?: string
}> = ({ category, headline, deck }) => {
  return (
    <header css={styles.header}>
      {category && <p css={styles.category}>{category}</p>}
      <h2 css={styles.headline}>{headline}</h2>
      {deck && <section css={styles.deck}>{deck}</section>}
      <div css={styles.titleWrapper}>
        <p css={styles.title}>{headline}</p>
      </div>
    </header>
  )
}

const Abstract = ({ text }: { text?: string }) => text ? (
  <section css={styles.abstract}>
    <p css={styles.abstractText}>{text}</p>
  </section>
) : <></>

const Epigraph = ({ text, author }: { text?: string; author?: string }) => text && author ? (
  <section css={styles.epigraph}>
    <p css={styles.epigraphText}>{text}</p>
    {author && <p css={styles.epigraphAuthor}>{author}</p>}
  </section>
) : <></>

const Meta = ({ date, dateFormatted }: { date: string, dateFormatted: string }) => (
  <section css={styles.meta}>
    <time dateTime={date}>{dateFormatted} KST</time>
  </section>
)

const Body = ({ body }: { body: string }) => (
  <div css={styles.body}>
    <MDXRenderer>{body}</MDXRenderer>
  </div>
)

// todo - 출처 표기랑 기존에 있던 CC 포맷 넣으면 좋을거같음. 그거 이쁨. 그리고 Buy me a coffee & DISQUS 도 넣을것
const Footer = () => (
  <footer css={styles.footer}></footer>
)

const styles = {
  headerWrapper: css`
    margin: 0 0 3rem 0;
    padding: 0;

    @media only screen and (max-width: 600px) {
      margin-bottom: 3rem;
      padding-top: 4.5rem;
    }
  `,
  header: css`
    margin: 0 auto;
    padding: 0 1rem;
    max-width: 650px;
  `,
  category: css`
    margin: 0 0 1.1rem 0.15rem;
    letter-spacing: 0.03rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--brand);
  `,
  headline: css`
    margin: 0;
    padding: 0;
    line-height: 1.4;
    font-size: 2.1rem;
    font-weight: 500;

    @media only screen and (max-width: 600px) {
      font-size: 1.65rem;
    }
  `,
  titleWrapper: css`
    position: fixed;
    z-index: -1;
    top: 15px;
    left: 24rem;
    right: 24rem;
    text-align: center;

    @media only screen and (max-width: 1100px) {
      left: 20rem;
      right: 20rem;
    }

    @media only screen and (max-width: 1000px) {
      left: 7rem;
      right: 7rem;
    }

    .scrolled-a-bit & {
      z-index: 12;
    }
  `,
  title: css`
    margin: 0 auto;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9792rem;
    transition: all 0.15s ease-out;
    transform: translate3d(0, 0.5rem, 0);
    opacity: 0;

    .scrolled-a-bit & {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    @media only screen and (max-width: 650px) {
      font-size: 0.8rem;
    }
  `,
  deck: css`
    margin: 0.95rem 0 0;
    padding: 0 0.1rem;
    line-height: 1.9;
    font-size: 1.2rem;

    @media only screen and (max-width: 600px) {
      font-size: 1.05rem;
    }
  `,
  abstract: css`
    margin: 3.5rem auto 0;
    padding: 0 1rem;
    max-width: 720px;
    display: flex;
    justify-content: center;
  `,
  abstractText: css`
    max-width: 500px;
    line-height: 1.9;
  `,
  epigraph: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    padding: 0 1rem 5rem;
    max-width: 650px;
    text-align: center;
  `,
  epigraphText: css`
    max-width: 450px;
    margin: 0 0 0.5rem 0;
    line-height: 1.9;
  `,
  epigraphAuthor: css`
    padding-top: 0.3rem;
    max-width: 500px;
    display: flex;
    align-items: center;
    margin: 0 0.225rem 0 0;
    letter-spacing: 0.03rem;

    ::before {
      content: '';
      margin-right: 0.44rem;
      width: 13px;
      height: 1px;
      background: #777;
    }
  `,
  meta: css`
    margin: 0 auto;
    padding: 0 1rem 0;
    width: 100%;
    max-width: 650px;
    letter-spacing: 0.02rem;
    font-size: 0.83rem;
  `,

  body: css`
    margin: 6rem auto 0;
    padding: 0 1rem;
    width: 100%;
    max-width: 650px;
    line-height: 2;
    font-size: 0.9792rem;

    @media only screen and (max-width: 600px) {
      margin-top: 5.5rem;
    }

    p,
    ul,
    ol {
      margin-bottom: 1.602rem;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-all;
      word-break: break-word;
      hyphens: auto;
    }

    ul,
    ol {
      padding-left: 1.5rem;

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

    a {
      text-decoration: none;

      &[href] {
        padding-bottom: 0.07rem;
        border-bottom: 1px solid var(--text-link);
        background-position: 0 100%;
        background-size: auto 3px;
        background-repeat: repeat-x;
        color: var(--text-link);

        &:hover {
          border-color: transparent;
          background-image: url('/images/underline.svg');
        }

        .dark &:hover {
          border-color: transparent;
          background-image: url('/images/underline-dark.svg');
        }
      }
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
    h2,
    h3,
    h4,
    h5 {
      margin: 2.75rem 0 1.602rem 0;
      line-height: 1.6;
      font-weight: 400;
    }

    h2 {
      font-size: 1.296rem;
      font-weight: 600;
    }

    h3 {
      font-size: 1.215rem;
    }

    h4 {
      font-size: 1.138rem;
    }

    h5 {
      font-size: 1.067rem;
    }

    small {
      font-size: 0.937rem;
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
  footer: css`
    margin: 5rem auto 0;
    max-width: 650px;
  `,
}

export default Article