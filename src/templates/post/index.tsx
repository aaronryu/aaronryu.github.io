import { graphql } from 'gatsby'
import { css } from '@emotion/react'
import useSiteMetadata from '../../hooks/use-sitemetadata'
import React, { useEffect, useState } from 'react'
import Article from './post-article'
import PostSeo from './post-seo'
import { useScroll } from './scroll'
import { NodeDetail } from '../../hooks/use-nodes-details'
import TableOfContents from './table-of-contents'

interface Props {
  location: string
  pageContext: any
  data: {
    mdx: NodeDetail
  }
}

const HEADER_OFFSET_Y = 81
const PostTemplate: React.FunctionComponent<Props> = ({
  location, data: { mdx }, pageContext
}) => {
  const { id, frontmatter, toc, body, slug } = mdx
  const categoryUrl = `/${frontmatter.category}`
  const articleUrl = `${categoryUrl}/${slug}`

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
      console.log(currentOffsetY)
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
          articleUrl={articleUrl}
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
          categories={frontmatter.categoryNames}
          headline={frontmatter.title}
          deck={frontmatter.deck}
          abstract={frontmatter.abstract}
          epigraph={frontmatter.epigraph}
          epigraphAuthor={frontmatter.epigraphAuthor}
          date={frontmatter.date}
          dateFormatted={frontmatter.dateFormatted}
          body={body}
          embeddedImagesLocal={frontmatter.embeddedImagesLocal}
          articleUrl={articleUrl}
          categoryUrl={categoryUrl}
        />
    </div>
  )
}

const styles = {
  container: css`
    margin-top: 4rem;
  `,
}

export const query = graphql`
  query($slug: String!) {
    mdx(slug: { eq: $slug }) {
      id
      slug
      toc: tableOfContents
      body
      frontmatter {
        title
        category
        categoryNames
        date(formatString: "MMMM D, YYYY")
        dateFormatted: date(formatString: "MMM D, YYYY hh:mmA")
        updateDate
        author
        image {
          childImageSharp {
            fluid(quality: 80, maxWidth: 1540) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        embeddedImagesLocal {
          childImageSharp {
            gatsbyImageData
          }
        }
        deck
        abstract
        epigraph
        epigraphAuthor
      }
    }
  }
`

export default PostTemplate
