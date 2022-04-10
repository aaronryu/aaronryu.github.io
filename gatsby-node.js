

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const [ developPostedEdged, contentfulData ] = await Promise.all([
    getFilePostedData('development', graphql, reporter),
    getContentfulData(graphql, reporter),
  ])
  
  developPostedEdged.forEach(edge => {
    createPage({
      path: edge.node.childMdx.frontmatter.category
        ? `${edge.node.childMdx.frontmatter.category}/${edge.node.childMdx.slug}`
        : `${edge.node.childMdx.slug}`,
      component: `${__dirname}/src/templates/post/index.tsx`,
      context: {
        slug: edge.node.childMdx.slug,
        // menu: developMenu
      }
    })
  })

  contentfulData.forEach(slug => {
    createPage({
      path: slug,
      component: `${__dirname}/src/templates/blog.tsx`,
      context: {
        slug: slug,
      }
    })
  })
}

async function getFilePostedData(node, graphql, reporter) {
  const postsResult = await graphql(`
    query {
      allFile(
        filter: {
          sourceInstanceName: { eq: "${node}" }
          extension: { eq: "mdx" }
        }
      ) {
        edges {
          node {
            childMdx {
              id
              slug
              frontmatter {
                date(formatString: "MMMM D, YYYY")
                title
                category
                categoryNames
              }
            }
          }
        }
      }
    }
  `)

  if (postsResult.errors) {
    reporter.panic('failed to create posts', postsResult.errors)
  }

  return postsResult.data.allFile.edges
}

async function getContentfulData(graphql, reporter) {
  const result = await graphql(`
    query {
      allContentfulGastbyTutorial {
        nodes {
          slug
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panic('failed to create contentful data', result.errors)
  }

  return result.data.allContentfulGastbyTutorial.nodes.map(node => node.slug)
}
