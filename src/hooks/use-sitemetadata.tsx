import { graphql, useStaticQuery } from 'gatsby'

const UseSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          deployBranch
        }
      }
    }
  `)

  return data.site.siteMetadata
}

export default UseSiteMetadata
