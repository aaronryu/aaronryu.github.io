import { graphql } from 'gatsby'
import { css } from '@emotion/react'
import useSiteMetadata from '../../hooks/use-sitemetadata'
import React, { useEffect, useState } from 'react'
import Article, { GatsbyImageSharpFluidWithWebp } from './post-article'
import PostSeo from './post-seo'
import { useScroll } from './scroll'

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

const HEADER_OFFSET_Y = 76
const PostTemplate: React.FunctionComponent<Props> = ({
  data: { mdx },
}) => {
  const { id, frontmatter, toc, body, slug } = mdx
  const { author, siteUrl } = useSiteMetadata()
  const imageSrc = frontmatter.image
    ? frontmatter.image.childImageSharp.fluid.srcWebp
    : ''
  const [currentHeaderUrl, setCurrentHeaderUrl] = useState<string>('')
  const { scrollY } = useScroll();

  const handleScroll = (currentOffsetY: number) => {
    let aboveHeaderUrl // 화면 바로 위쪽에 위치한 header
    const headerElements: NodeListOf<Element> = document.querySelectorAll('.anchor-header')
    for (const elem of Array.from(headerElements)) {
      const { top } = elem.getBoundingClientRect()
      const elemTop = top + currentOffsetY
      const isLast = elem === headerElements[headerElements.length - 1]
      if (currentOffsetY < elemTop - HEADER_OFFSET_Y) {
        // 기억해둔 aboveHeaderUrl이 있다면 바로 위 header와 현재 element 사이에 화면이 스크롤 되어 있다.
        aboveHeaderUrl &&
          setCurrentHeaderUrl(aboveHeaderUrl)
        // 기억해둔 aboveHeaderUrl이 없다면 첫번째 header다. 
        // 이때는 어떤 header도 active 하지 않은 상태다.
        !aboveHeaderUrl && setCurrentHeaderUrl('')
        break;
      } else {
        // 마지막 header면 다음 element가 없기 때문에 현재 header를 active header라 간주한다.
        const href = elem.getAttribute('href')
        if (href) {
          if (isLast)
            setCurrentHeaderUrl(decodeURI(href))
          else
            aboveHeaderUrl = decodeURI(href)
        }
      }
    }
  };

  useEffect(() => {
    handleScroll(scrollY)
  }, [scrollY])

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
        depth={4}
        currentHeaderUrl={currentHeaderUrl}
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

const makeTocHeaderHtml = (each: TocHeader, remainDepth: number) => {
  if (each.items !== undefined) {
    return (
      <React.Fragment key={each.title}>
        <li><a href={each.url}>{each.title}</a></li>
        <ul>{makeTocHeadersHtml(each.items, (remainDepth - 1))}</ul>
      </React.Fragment>
    );
  } else {
    return <li key={each.title}><a href={each.url}>{each.title}</a></li>;
  }
}

const makeTocHeadersHtml = (items: Array<TocHeader>, depth: number) => {
  return <React.Fragment key={depth}>{(depth > 0) && items.map((each) => makeTocHeaderHtml(each, depth))}</React.Fragment>
}

const makeToc = (toc: TocHeaders, depth: number) => {
  return <ul>{makeTocHeadersHtml(toc.items, depth)}</ul>
}

const TableOfContents = ({ toc, depth, currentHeaderUrl }: { toc: TocHeaders, depth: number, currentHeaderUrl: string }) => {
  return (
    <div
      css={{
        'ul:first-child': {
          marginLeft: '-0.8rem',
        },
        // 낮은 depth가 더 안쪽으로 들어가도록 모든 ul에 marginLeft를 부여한다.
        '& ul': {
          marginLeft: '-1.4rem',
        },
        // currentHeaderUrl 문자열이 href 속성에 포함된다면 아래 스타일을 부여한다. 
        // 현재 스크롤에 해당하는 Header를 하이라이트 하기 위함
        [`& ul > li a[href*="${currentHeaderUrl}"]`]: {
          color: 'var(--text0)',
          fontWeight: '600',
        },
        fontSize: '0.73rem',
        lineHeight: '1.2rem',
        fontWeight: 500,
        //
        position: 'fixed',
        top: 100,
        minHeight: 100,
        margin: '1rem 1rem 1rem calc(50vw + 400px - 10px)',
        '@media only screen and (max-width: 1280px)': {
          margin: '1rem 1rem 1rem calc(800px - 10px)',
        },
        '@media only screen and (max-width: 1024px)': {
          margin: '1rem 1rem 1rem calc(800px - 10px)',
          'ul:first-child': {
            marginLeft: '-1rem',
          },
          // 낮은 depth가 더 안쪽으로 들어가도록 모든 ul에 marginLeft를 부여한다.
          '& ul': {
            marginLeft: '-1.8rem',
          },
          fontSize: '0.65rem',
          lineHeight: '1rem',
        },

        borderLeft: '1px solid var(--hr)',
      }}
    >
      {makeToc(toc, depth)}
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
