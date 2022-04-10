import { graphql, useStaticQuery } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import { TocHeaders } from '../templates/post/table-of-contents'

export interface GatsbyImageSharpFluidWithWebp {
  aspectRatio: number
  base64: string
  sizes: string
  src: string
  srcSet: string
  srcSetWebp: string
  srcWebp: string
}

export interface ChildImage {
  childImageSharp: {
    gatsbyImageData: IGatsbyImageData
  }
};

export interface ChildImageWithUrl {
  childImageSharp: {
    gatsbyImageData: IGatsbyImageData
    fluid: GatsbyImageSharpFluidWithWebp
  }
};

export interface NodeResult {
  allFile: {
    edges: Array<{ node: Node }>
  }
}

export interface Node {
  sourceInstanceName: string
  childMdx: NodeDetail
}
export interface NodeDetail {
  id: string
  frontmatter: {
    title: string /* 제목에 해당합니다. */
    category: string /* js */
    categoryNames: Array<string> /* Javascript */
    author: string /* Aaron Ryu */
    date: string /* 2021-10-28 */
    dateFormatted: string
    updateDate: string /* 2021-10-28 */
    imageAlt?: string
    image?: ChildImageWithUrl /* ./example.jpg */
    embeddedImagesLocal: ChildImage
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

const UseNodeDetails = (source?: string, limit?: number): Array<NodeDetail> => {
  const data: NodeResult = useStaticQuery(graphql`
    query {
      allFile(
        filter: { extension: { eq: "mdx" } }
        sort: { fields: [childMdx___frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            sourceInstanceName
            childMdx {
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
                imageAlt
                image {
                  childImageSharp {
                    gatsbyImageData
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
        }
      }
    }
  `)
  return data.allFile.edges
    .filter(eachNode => source ? (eachNode.node.sourceInstanceName === source) : true)
    .map(eachNode => eachNode.node.childMdx)
    .slice(0, limit)
}

export default UseNodeDetails
