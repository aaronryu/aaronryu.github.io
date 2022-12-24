import React from 'react'
import { css } from '@emotion/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'
import { ChildImage, ChildImageWithUrl } from '../../hooks/use-nodes-details'
import Comment from "../../components/comment"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreativeCommons } from '@fortawesome/free-brands-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import useSiteMetadata from '../../hooks/use-sitemetadata'
import styled from '@emotion/styled'

export interface ArticleProps {
  categories: Array<string>
  headline: string
  body: string
  date: string
  dateFormatted: string
  deck?: string
  abstract?: string
  epigraph?: string
  epigraphAuthor?: string
  embeddedImagesLocal?: ChildImage
  articleUrl: string
  categoryUrl: string
  imageAlt?: string
  image?: ChildImageWithUrl
}

const Article: React.FunctionComponent<ArticleProps> = ({
  categories,
  headline,
  deck,
  abstract,
  epigraph,
  epigraphAuthor,
  body,
  date,
  dateFormatted,
  embeddedImagesLocal,
  articleUrl,
  categoryUrl,
  imageAlt,
  image,
}) => (
  <article>
    <div css={styles.headerWrapper}>
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
      />
      <Abstract text={abstract} />
    </div>
    <Epigraph text={epigraph} author={epigraphAuthor} />
    <Meta date={date} dateFormatted={dateFormatted} />
    <Body localImages={embeddedImagesLocal} body={body} />
    <ArticleFooter title={headline} url={articleUrl} user={'Aaron'} postedOn={dateFormatted} />
  </article>
)

const CustomGatsbyImage = styled(GatsbyImage)`
  div:first-child {
    max-width: 100% !important;
  }
`

export const Header: React.FunctionComponent<{
  categories: Array<string>
  headline: string
  deck?: string
  date: string
  dateFormatted: string
  articleUrl: string
  categoryUrl: string
  summerized?: boolean
  imageAlt?: string
  image?: ChildImageWithUrl
}> = ({ categories, headline, deck, date, dateFormatted, articleUrl, categoryUrl, summerized, imageAlt, image }) => {
  return (
    <header css={[styles.header, (!summerized && styles.headerSizer)]}>
      {image && (
        <CustomGatsbyImage
          imgStyle={{ borderRadius: 2 }}
          style={{ width: '100%', ...(summerized && {  aspectRatio: '2.6' }) }}
          alt={imageAlt ?? ''}
          image={image.childImageSharp.gatsbyImageData}
        />
      )}

      {categories && (categories.length > 0) && (
        <p css={[styles.category, styles.summerizedPadding]}>
          <Link to={categoryUrl}>{categories.join(' / ')}</Link>
          {summerized && <time dateTime={date}>{dateFormatted} KST</time>}
        </p>
      )}

      <h2 css={styles.headline}>
        <Link to={articleUrl}>
          {headline}
        </Link>
      </h2>

      {deck && <section css={styles.deck}>{deck}</section>}
      <div css={styles.titleWrapper}>
        <p css={styles.title}>{headline}</p>
      </div>
    </header>
  )
}

export const Abstract = ({ text, summerized }: { text?: string, summerized?: boolean }) => text ? (
  <section css={[styles.abstract, (!summerized && styles.abstractSizer)]}>
    <p css={styles.abstractText}>{text}</p>
  </section>
) : <></>

export const Epigraph = ({ text, author, summerized }: { text?: string; author?: string, summerized?: boolean }) => text && author ? (
  <section css={[styles.epigraph, (!summerized && styles.epigraphSizer)]}>
    <p css={styles.epigraphText}>{text}</p>
    {author && <p css={styles.epigraphAuthor}>{author}</p>}
  </section>
) : <></>

export const Meta = ({ date, dateFormatted, summerized }: { date: string, dateFormatted: string, summerized?: boolean }) => (
  <section css={[styles.meta, (!summerized && styles.metaSizer)]}>
    <time dateTime={date}>{dateFormatted} KST</time>
  </section>
)

export const Body = ({ localImages, body, summerized }: { localImages?: ChildImage, body: string, summerized?: boolean }) => (
  <div css={[styles.body, (!summerized && styles.bodySizer)]}>
    <MDXRenderer localImages={localImages}>{body}</MDXRenderer>
  </div>
)

export const ArticleFooter = ({ title, url, user, postedOn, summerized }: { title: string, url: string, user: string, postedOn: string, summerized?: boolean }) => (
  <footer css={[styles.body, (!summerized && styles.bodySizer)]}>
    <CreativeCommonsCard title={title} url={url} user={user} postedOn={postedOn} />
    <Comment />
  </footer>
)

export const CreativeCommonsCard = ({ title, url, user, postedOn }: { title: string, url: string, user: string, postedOn: string }) => {
  const { siteUrl } = useSiteMetadata()
  return (
    <div css={styles.createCommonBox}>
      <div style={{ marginBottom: '20px' }}>
        {title}
        <div style={{ marginTop: '4px' }}>
          <a href={url} style={{ fontSize: '0.9rem' }}>
          {`${siteUrl}${url}`}
          </a>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '20px' }}>
          <div style={{ fontSize: '0.84rem' }}>Author</div>
          <div>{user}</div>
        </div>
        <div style={{ marginRight: '20px' }}>
          <div style={{ fontSize: '0.84rem' }}>Posted on</div>
          <div>{postedOn}</div>
        </div>
        <div style={{ marginRight: '20px' }}>
          <div style={{ fontSize: '0.84rem' }}>Licensed under</div>
          <div style={{ cursor: 'pointer' }} onClick={() => window.open('https://creativecommons.org/licenses/by-nc-sa/4.0/', '_blank')} >
            <FontAwesomeIcon icon={faCreativeCommons as IconProp} size={"lg"} style={{ marginRight: '4px' }} />
            CC BY-NC-SA 4.0
          </div>
        </div>
      </div>
      <div css={styles.createCommonOpacityIcon}>
        <FontAwesomeIcon icon={faCreativeCommons as IconProp} style={{ fontSize: '14em' }} />
      </div>
    </div>
  )
}

const styles = {
  createCommonBox: css`
    z-index: 1;
    padding: 1.2rem;
    background-color: var(--text-link-background);
    line-height: 1.2;
    position: relative;
    overflow: hidden;
    margin-bottom: 1.5rem;
    border-radius: 4px;
  `,
  createCommonOpacityIcon: css`
    display: inline-block;
    position: absolute;
    z-index: -1;
    right: -3rem;
    top: -3.5rem;
    opacity: 0.1;
  `,
  summerizedTitleImage: css`
    margin-right: -1rem;
    margin-left: -1rem;
  `,
  headerWrapper: css`
    margin: 0 0 1rem 0;
    padding: 0;
  `,
  header: css`
    margin: 0 auto;

    padding: 0 1rem;
    max-width: 800px;
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
  category: css`
    display: flex;
    justify-content: space-between;

    margin: 0 0 1.1rem 0.15rem;
    letter-spacing: 0.03rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--brand);
  `,
  summerizedPadding: css`
    padding-top: 1.4rem;
  `,
  headline: css`
    margin: 0;
    padding: 0;
    line-height: 1.4;
    font-size: 1.6rem;
    font-weight: 500;

    @media only screen and (max-width: 700px) {
      font-size: 1.25rem;
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

    @media only screen and (max-width: 700px) {
      font-size: 0.84rem;
    }
  `,
  deck: css`
    margin: 0.95rem 0 0;
    padding: 0 0.1rem;
    line-height: 1.9;
    font-size: 1.0rem;

    @media only screen and (max-width: 700px) {
      font-size: 0.86rem;
    }
  `,
  abstract: css`
    margin: 0 auto 0;

    padding: 0 1rem;
    max-width: 750px;
    display: flex;
    justify-content: center;
  `,
  abstractSizer: css`
    @media only screen and (max-width: 1280px) {
      margin: 0 auto 0 74px;
      padding: 0 1.2rem;
    }
    @media only screen and (max-width: 1024px) {
      margin: 0 24px 0 24px;
      padding: 0 1.2rem;
    }
    @media only screen and (max-width: 970px) {
      margin: 0 auto;
      padding: 0 1.2rem;
    }
  `,
  abstractText: css`
    max-width: 700px;
    line-height: 1.9;

    @media only screen and (max-width: 700px) {
      font-size: 0.84rem;
    }
  `,
  epigraph: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    @media only screen and (max-width: 700px) {
      padding: 0 0.9rem 1.8rem;
      font-size: 0.84rem;
    }

    padding: 0 1rem 2rem;
    max-width: 650px;
    text-align: center;
  `,
  epigraphSizer: css`
    @media only screen and (max-width: 1280px) {
      margin: 0 auto 0 116px;
    }
    @media only screen and (max-width: 1024px) {
      margin: 0 74px 0 74px;
    }
    @media only screen and (max-width: 970px) {
      margin: 0 auto;
    }
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
    max-width: 800px;
    letter-spacing: 0.02rem;
    font-size: 0.83rem;
    color: var(--brand);
  `,
  metaSizer: css`
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
  bodySizer: css`
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
  body: css`
    margin: 2rem auto 0;

    padding: 0 1rem;
    width: 100%;
    max-width: 800px;
    line-height: 2;
    font-size: 1.0rem;

    @media only screen and (max-width: 700px) {
      font-size: 0.84rem;
    }

    p,
    ul,
    ol {
      // margin-top: 1.6rem;
      // margin-bottom: 1.6rem;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-all;
      hyphens: auto;
    }

    ul,
    ol {

      ul,
      ol {
   
      }
    }

    blockquote {
      margin-left: 2.1rem;
      margin-right: 2.1rem;
      font-size: 0.9rem;
      font-style: italic;
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
      margin: 2rem auto 2rem;
      padding: 0;
      border: none;
      width: 78%;
      height: 1px;
      background: none;

      &::after {
        content: ' ';
        position: absolute;
        top: 0;
        width: 100%;
        height: 1px;
        background-color: var(--text);
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      margin: 2.75rem 0 1.602rem 0;
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
      @media only screen and (max-width: 700px) {
        font-size: 1.196rem;
      }
    }

    h3 {
      font-size: 1.215rem;
      @media only screen and (max-width: 700px) {
        font-size: 1.115rem;
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

    .gatsby-image-wrapper-constrained {
      display: flex;
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

export default Article