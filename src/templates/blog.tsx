import { Link } from 'gatsby'
import { graphql } from 'gatsby'
import * as React from 'react'
import { isConstructorDeclaration } from 'typescript'
import Layout from '../components/layout'

interface Props {
  data: any
}

const Blog: React.FunctionComponent<Props> = ({ data }) => {
  console.log(data)
  const blog = data.contentfulGastbyTutorial
  return (
    <Layout /* pageTitle="My Blog Posts" */>
          <article>
            <h2>
              <Link to={`/${blog.slug}`}>
                {blog.title}
              </Link>
            </h2>
            <p>Posted: {blog.creationDate}</p>
          </article>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    contentfulGastbyTutorial(slug: { eq: $slug }) {
      title
      slug
      creationDate(formatString: "MMMM D, YYYY")
      contents {
        raw
      }
    }
  }
`

export default Blog