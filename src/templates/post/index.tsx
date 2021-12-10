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
      body: string
      slug: string
    }
  }
}

const PostTemplate: React.FunctionComponent<Props> = ({
  data: { mdx },
}) => {
  const { id, frontmatter, body, slug } = mdx
  const { author, siteUrl } = useSiteMetadata()
  const imageSrc = frontmatter.image
    ? frontmatter.image.childImageSharp.fluid.srcWebp
    : ''

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
        body={body}
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
      body
      slug
    }
  }
`

export default PostTemplate
