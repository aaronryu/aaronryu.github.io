exports.createPages = async ({ actions, graphql, reporter }) => {
  // console.log(actions)
  // console.log(graphql)
  // console.log(reporter)
  const { createPage } = actions

  const [ filePostedEdged, contentfulData ] = await Promise.all([
    getFilePostedData(graphql, reporter),
    getContentfulData(graphql, reporter),
  ])
  filePostedEdged.forEach(edge => {
    createPage({
      path: edge.node.childMdx.slug,
      component: `${__dirname}/src/templates/post.tsx`,
      context: {
        slug: edge.node.childMdx.slug,
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

async function getFilePostedData(graphql, reporter) {
  const postsResult = await graphql(`
    query {
      allFile(
        filter: {
          sourceInstanceName: { eq: "blog" }
          extension: { eq: "mdx" }
        }
      ) {
        edges {
          node {
            childMdx {
              slug
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
