import React from "react"
import Seo from "../../components/seo"

export type ArticleSchemaType =
  "TechArticle" |
  "AnalysisNewsArticle" |
  "OpinionNewsArticle" |
  "ReviewNewsArticle"

interface SeoProps {
  type?: ArticleSchemaType
  articleUrl: string
  siteUrl: string
  author: string
  title: string
  date: string
  updateDate: string
  imageSrc?: string
  deck?: string
  abstract?: string
}

// todo - how to boost my SEO. type 어떤걸로 하는게 좋을까 TechArticle 말고 좀 더 고도화하고싶은데, 정의된게 있는지 내가 직접 정의하면 되는건지?
const PostSeo: React.FunctionComponent<SeoProps> = ({
  type,
  imageSrc,
  siteUrl,
  author,
  title,
  date,
  updateDate,
  deck,
  abstract,
  articleUrl,
}) => (
  <>
    <Seo
      title={title}
      description={deck || abstract}
      meta={
        imageSrc ? [{ property: 'og:image', content: siteUrl + imageSrc }] : []
      }
    />
    <script type="application/ld+json">{`
      {
        "@context": "http://schema.org",
        "@type": "${type ? type : 'TechArticle'}",
        "headline": "${title}",
        "datePublished": "${date}",
        "dateModified": "${updateDate}",
        "image": ${JSON.stringify(imageSrc ? [siteUrl + imageSrc] : [])},
        "author": {
          "@type": "Person",
          "name": "${author}"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Aaron Ryu",
          "logo": {
            "@type": "ImageObject",
            "url": "${siteUrl}/images/profile-todo-change.png"
          }
        },
        "description": "${deck || abstract}",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "${siteUrl}/${articleUrl}"
        }
      }
  `}</script>
  </>
)

export default PostSeo