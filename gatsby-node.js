exports.createPages = async ({ actions, graphql, reporter }) => {
  // console.log(actions)
  // console.log(graphql)
  // console.log(reporter)
  const { createPage } = actions

  const [ filePostedEdged, contentfulData ] = await Promise.all([
    getFilePostedData(graphql, reporter),
    getContentfulData(graphql, reporter),
  ])
  
  filePostedEdged.forEach(childMdx => {
    createPage({
      path: childMdx.slug,
      component: `${__dirname}/src/templates/post.tsx`,
      context: {
        slug: childMdx.slug,
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
      allMdx(sort: {fields: frontmatter___date, order: DESC}) {
        nodes {
          slug
        }
      }
    }
  `)

  if (postsResult.errors) {
    reporter.panic('failed to create posts', postsResult.errors)
  }

  return postsResult.data.allMdx.nodes
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
