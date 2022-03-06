import { css } from "@emotion/react"
import { graphql } from "gatsby"
import PostSeo from "../templates/post/post-seo"
import ArticleSummerized from "../templates/post/post-summerized"
import useSiteMetadata from '../hooks/use-sitemetadata'
import { log } from "../utils/logger"
import Seo, { MetaImage, MetaOption } from "../components/seo"
import { NodeDetail } from "../templates/post"

interface Props {
  data: {
    allFile: {
      edges: Array<{ node: { childMdx: NodeDetail } }>
    }
  }
}

const IndexPage: React.FunctionComponent<Props> = ({ data: { allFile: { edges } }}) => {
  log(() => console.log(edges))
  
  const { description, deployBranch } = useSiteMetadata()
  const meta: Array<MetaImage | MetaOption> =
    [{ property: 'og:image', content: '/images/cover-todo-change.png' }]
  if (deployBranch !== 'master')
    meta.push({ name: 'robots', content: 'noindex,nofollow' })
  
  return (
    <div css={styles.container}>
      <Seo
        lang="en"
        title=""
        meta={meta}
        description={description}
      />
      {edges.map(({ node: { childMdx: node } }) => {
        log(() => console.log(node))
        return (
          <ArticleSummerized
            key={node.frontmatter.title}
            categories={node.frontmatter.categoryNames}
            headline={node.frontmatter.title}
            deck={node.frontmatter.deck}
            abstract={node.frontmatter.abstract}
            epigraph={node.frontmatter.epigraph}
            epigraphAuthor={node.frontmatter.epigraphAuthor}
            date={node.frontmatter.date}
            dateFormatted={node.frontmatter.dateFormatted}
            articleUrl={`/${node.frontmatter.category}/${node.slug}`}
            categoryUrl={`/${node.frontmatter.category}`}
          />
        )
      })}
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
            frontmatter {
              category
              categoryNames
              title
              author
              date
              dateFormatted: date(formatString: "MMM D, YYYY hh:mmA")
              updateDate
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
            toc: tableOfContents
            body
            slug
          }
        }
      }
    }
  }
`

export default IndexPage
