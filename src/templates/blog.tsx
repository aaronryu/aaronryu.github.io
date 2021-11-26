import { Link } from 'gatsby'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import * as React from 'react'
import Layout from '../components/layout'

interface Props {
  data: {
    contentfulGastbyTutorial: {
      title: string
      slug: string
      creationDate: string
      body: {
        childMdx: { body: string },
      }
    }
  }
}

const Blog: React.FunctionComponent<Props> = ({
  data: {
    contentfulGastbyTutorial: {
      title,
      slug,
      creationDate,
      body: {
        childMdx: { body: mdx },
      }
    }
  }
}) => (
  <Layout /* pageTitle="My Blog Posts" */>
    <header>
      <h1>{title}</h1>
      <p>Posted: {creationDate}</p>
    </header>
    <div>
      <MDXRenderer>{mdx}</MDXRenderer>
    </div>
  </Layout>
)

export const query = graphql`
  query($slug: String!) {
    contentfulGastbyTutorial(slug: { eq: $slug }) {
      title
      slug
      creationDate(formatString: "MMMM D, YYYY")
      body {
        childMdx {
          body
        }
      }
    }
  }
`

export default Blog