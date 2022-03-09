import { graphql, useStaticQuery } from 'gatsby'

export interface SiteMetadata {
  title: string
  description: string
  author: string
  siteUrl: string
  deployBranch: string
  linkGithub: string
  linkFacebook: string
  linkTwitter: string
}

const UseSiteMetadata = (): SiteMetadata => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
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

export default UseSiteMetadata
