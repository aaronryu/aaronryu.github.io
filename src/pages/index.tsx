import { css } from "@emotion/react"
import { graphql } from "gatsby"
import PostSeo from "../templates/post/post-seo"
import ArticleSummerized from "../templates/post/post-summerized"
import useSiteMetadata from '../hooks/use-sitemetadata'
import { log } from "../utils/logger"

interface Props {
  data: {
    allFile: {
      edges: Array<Node>
    }
  }
}

const IndexPage: React.FunctionComponent<Props> = ({ data: { allFile: { edges } }}) => {
  log(() => console.log(edges))
  
  const { author, siteUrl } = useSiteMetadata()
  
  return (
    <div css={styles.container}>

        {/* <PostSeo
          // type
          {...{ imageSrc, siteUrl, author }}
          slug={frontmatter.slug}
          title={frontmatter.title}
          deck={frontmatter.deck}
          abstract={frontmatter.abstract}
          date={frontmatter.date}
          updateDate={frontmatter.updateDate}
        />
        <ArticleSummerized
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
        /> */}
    </div>
  )
}

const styles = {
  container: css`
    margin-top: 4rem;
  `,
}

export const query = graphql`
  query {
    allFile(
      filter: { extension: { eq: "mdx" } },
      limit: 10,
      sort: { fields: [childMdx___frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          childMdx {
            id
            slug
            frontmatter {
              date(formatString: "MMMM D, YYYY")
              title
              category
              categoryNames
            }
          }
        }
      }
    }
  }
`

export default IndexPage
