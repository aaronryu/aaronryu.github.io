import { css } from "@emotion/react"
import ArticleSummerized from "../templates/post/post-summerized"
import useSiteMetadata from '../hooks/use-sitemetadata'
import Seo, { MetaImage, MetaOption } from "../components/seo"
import UseNodeDetails, { NodeDetail } from "../hooks/use-nodes-details"

const IndexPage: React.FunctionComponent = () => {
  const nodeDetails: Array<NodeDetail> = UseNodeDetails()
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
      {nodeDetails.map((node) => {
        const categoryUrl = `/${node.frontmatter.category}`
        const articleUrl = `${categoryUrl}/${node.slug}`
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
            articleUrl={articleUrl}
            categoryUrl={categoryUrl}
            imageAlt={node.frontmatter.imageAlt}
            image={node.frontmatter.image}
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

export default IndexPage
