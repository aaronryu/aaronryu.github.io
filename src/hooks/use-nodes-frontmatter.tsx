import { graphql, useStaticQuery } from 'gatsby'

export interface SiteMetadata {
  title: string
  description: string
  author: string
  deployBranch: string
  linkGithub: string
  linkFacebook: string
  linkTwitter: string
}

const UseNodesFrontmatter = (nodeSource): SiteMetadata => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          deployBranch
          linkGithub
          linkFacebook
          linkTwitter
        }
      }
    }
  `)

  return data.site.siteMetadata
}

export default UseNodesFrontmatter
