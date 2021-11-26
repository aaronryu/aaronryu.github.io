exports.createPages = async ({ actions, graphql, reporter }) => {
  // console.log(actions)
  // console.log(graphql)
  // console.log(reporter)
  const { createPage } = actions

  const [ filePostedEdged ] = await Promise.all([ getFilePostedData(graphql, reporter) ])
  console.log(filePostedEdged)
  filePostedEdged.forEach(childMdx => {
    createPage({
      path: childMdx.slug,
      component: `${__dirname}/src/templates/post.tsx`,
      context: {
        slug: `${childMdx.slug}`,
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