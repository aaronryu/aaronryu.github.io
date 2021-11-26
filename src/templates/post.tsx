import { Link } from 'gatsby'
import { graphql } from 'gatsby'
import * as React from 'react'
import { isConstructorDeclaration } from 'typescript'
import Layout from '../components/layout'

interface Props {
  data: any
}

const Post: React.FunctionComponent<Props> = ({ data }) => {
  console.log(data)
  const idd = data.mdx.slug
  console.log(idd)
  return (
    <Layout /* pageTitle="My Blog Posts" */>
          <article>
            <h2>
              <Link to={`/${data.mdx.slug}`}>
                {data.mdx.frontmatter.title}
              </Link>
            </h2>
            <p>Posted: {data.mdx.frontmatter.date}</p>
          </article>
    </Layout>
  )
}

export const query = graphql`
    query($slug: String!) {
        mdx(slug: { eq: $slug }) {
          id
          frontmatter {
            title
            date(formatString: "MMMM D, YYYY")
            hero_image_alt
            hero_image_credit_link
            hero_image_credit_text
            hero_image {
                childImageSharp {
                    gatsbyImageData
                }
            }
          }
          body
          slug
        }
    }
`

export default Post