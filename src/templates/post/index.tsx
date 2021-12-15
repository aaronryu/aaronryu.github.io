import { graphql } from 'gatsby'
import { css } from '@emotion/react'
import useSiteMetadata from '../../hooks/use-sitemetadata'
import React from 'react'
import Article, { GatsbyImageSharpFluidWithWebp } from './post-article'
import PostSeo from './post-seo'

export interface PostPreview {
  slug: string
  title: string
  category: string
  date: string
  dateFormatted: string
  deck?: string
}

export interface TocHeaders {
  items: Array<TocHeader>
}

export interface TocHeader {
  url: string, title: string, items?: Array<TocHeader>
}

interface Props {
  data: {
    mdx: {
      id: string
      frontmatter: {
        title: string /* 제목에 해당합니다. */
        slug: string /* example-post */
        category: string /* Javascript (todo - 이거 nested 로 확장하고 싶음) */
        author: string /* Aaron Ryu */
        date: string /* 2021-10-28 */
        dateFormatted: string
        updateDate: string /* 2021-10-28 */
        imageAlt?: string /* example.jpg name */
        image: { /* ./example.jpg */
          childImageSharp: {
            fluid: GatsbyImageSharpFluidWithWebp
          }
        }
        /* gatsby-plugin-layout 넣었으니까, heroImage 필요없다. */
        deck?: string /* (1) 가장 위에 뜸 */
        abstract?: string /* (2) 그 다음 작은 폰트로 */
        epigraph?: string /* (3) 더 작은 폰트로 */
        epigraphAuthor?: string /* (3) 위인 */
      }
      toc: TocHeaders
      body: string
      slug: string
    }
  }
}

const PostTemplate: React.FunctionComponent<Props> = ({
  data: { mdx },
}) => {
  const { id, frontmatter, toc, body, slug } = mdx
  const { author, siteUrl } = useSiteMetadata()
  const imageSrc = frontmatter.image
    ? frontmatter.image.childImageSharp.fluid.srcWebp
    : ''
  console.log(toc)
  return (
    <div css={styles.container}>
      <PostSeo
        // type
        {...{ imageSrc, siteUrl, author }}
        slug={frontmatter.slug}
        title={frontmatter.title}
        deck={frontmatter.deck}
        abstract={frontmatter.abstract}
        date={frontmatter.date}
        updateDate={frontmatter.updateDate}
      />
      <TableOfContents
        toc={toc}
        currentHeaderUrl={''}
      />
      <Article
        siteUrl={siteUrl}
        slug={frontmatter.slug}
        category={frontmatter.category}
        headline={frontmatter.title}
        deck={frontmatter.deck}
        abstract={frontmatter.abstract}
        epigraph={frontmatter.epigraph}
        epigraphAuthor={frontmatter.epigraphAuthor}
        date={frontmatter.date}
        dateFormatted={frontmatter.dateFormatted}
        image={frontmatter.image}
        imageAlt={frontmatter.imageAlt}
        toc={toc}
        body={body}
      />
    </div>
  )
}

const makeTocHeaderHtml = (each: TocHeader): string => {
  if (each.items !== undefined) {
    return `<li><a href='${each.url}'>${each.title}</a></li>` + `<ul>${makeTocHeadersHtml(each.items)}</ul>`;
  } else {
    return `<li><a href='${each.url}'>${each.title}</a></li>`;
  }
}

const makeTocHeadersHtml = (items: Array<TocHeader>) => {
  return items.map((each) => makeTocHeaderHtml(each)).join('')
}

const TableOfContents = ({ toc, currentHeaderUrl }: { toc: TocHeaders, currentHeaderUrl: string }) => {
  const itemsHtml = `<ul>${makeTocHeadersHtml(toc.items)}</ul>`
  return (
    <div
      css={{
        position: 'fixed',
        top: 300,
        width: 600,
        height: 100,
        right: 0,
        backgroundColor: 'grey',
        '@media screen and (calc((100vw - 720px) / 2 - 50px))': {
          display: 'none',
          '@media screen and (min-width: 1200px)': {
            display: 'block',
            fontSize: '14px',
          },
        },
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: itemsHtml }}
        css={{
          // 낮은 depth가 더 안쪽으로 들어가도록 모든 ul에 marginLeft를 부여한다.
          '& ul': {
            marginLeft: '20px', 
          },
          // currentHeaderUrl 문자열이 href 속성에 포함된다면 아래 스타일을 부여한다. 
          // 현재 스크롤에 해당하는 Header를 하이라이트 하기 위함
          [`& ul > li a[href*="${currentHeaderUrl}"]`]: { 
            fontSize: '15px',
            color: '#333333',
            fontWeight: '600',
          },
        }}
      />
    </div>
  )
}


const styles = {
  container: css`
    margin-top: 4rem;

    @media only screen and (max-width: 600px) {
      margin-top: 0.5rem;
    }
  `,
}

export const query = graphql`
  query($slug: String!) {
    mdx(slug: { eq: $slug }) {
      id
      frontmatter {
        slug
        category
        title
        author
        date
        dateFormatted: date(formatString: "MMM D, YYYY hh:mmA")
        updateDate
        imageAlt
        image {
          childImageSharp {
            fluid(quality: 80, maxWidth: 1540) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        deck
        abstract
        epigraph
        epigraphAuthor
      }
      toc: tableOfContents
      body
      slug
    }
  }
`

export default PostTemplate
