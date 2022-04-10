import { css } from "@emotion/react"
import ArticleSummerized from "../templates/post/post-summerized"
import useSiteMetadata from '../hooks/use-sitemetadata'
import Seo, { MetaImage, MetaOption } from "../components/seo"
import UseNodeDetails, { NodeDetail } from "../hooks/use-nodes-details"
import { useEffect, useRef, useState } from "react"


const IndexPage: React.FunctionComponent = () => {
  const MAX_SUMMERY_QUERY_SIZE = 20
  const PAGE_SIZE = 4
  const [limit, setLimit] = useState(PAGE_SIZE)

  const nodeDetails: Array<NodeDetail> = UseNodeDetails(undefined, MAX_SUMMERY_QUERY_SIZE)
  const totalCount = nodeDetails.length
  const allReceived = totalCount <= limit

  const { description, deployBranch } = useSiteMetadata()
  const meta: Array<MetaImage | MetaOption> =
    [{ property: 'og:image', content: '/images/cover-todo-change.png' }]
  if (deployBranch !== 'master')
    meta.push({ name: 'robots', content: 'noindex,nofollow' })

  const expandPagination = () => {
    setLimit(limit + PAGE_SIZE)
  }

  const paginationAutoScroll = useRef() as React.MutableRefObject<HTMLDivElement>;

  const scrollToBottom = () => {
    paginationAutoScroll.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [limit]);

  return (
    <div css={styles.container}>
      <Seo
        lang="en"
        title=""
        meta={meta}
        description={description}
      />
      {nodeDetails.slice(0, limit).map((node) => {
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
      {!allReceived && (
        <div css={styles.pageButton} onClick={() => expandPagination()}>Retrieve more</div>
      )}
      <div ref={paginationAutoScroll} />
    </div>
  )
}

const styles = {
  container: css`
    margin-top: 4rem;
  `,
  pageButton: css`
    margin: 0 auto 2rem;
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
    
    cursor: pointer;

    background-color: var(--text-link-background);
    border-radius: 2px;
    text-align: center;
    
    max-width: 800px;
  `,
}

export default IndexPage
