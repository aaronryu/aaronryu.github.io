exports.createPages = async ({ actions, graphql, reporter }) => {
  // console.log(actions)
  // console.log(graphql)
  // console.log(reporter)
  const { createPage } = actions
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })

  const [ filePostedEdged ] = await Promise.all([ getFilePostedData(graphql, reporter) ])
  console.log(filePostedEdged)
  filePostedEdged.forEach(childMdx => {
    createPage({
      path: childMdx.slug + '/',
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
      allMdx {
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