

exports.createPages = async ({ actions, graphql, reporter }) => {
  // console.log(actions)
  // console.log(graphql)
  // console.log(reporter)
  const { createPage } = actions

  // menus.forEach(menu => {
  //   if (menu.subMenu) {
  //     menu.subMenu.forEach(subMenu => {
  //       createPage({
  //         path: subMenu.to,
  //         component: subMenu.component
  //           ? `${__dirname}/${subMenu.component}`
  //           : `${__dirname}/src/templates/archive/index.tsx`
  //       })
  //     })
  //   } else {
  //     createPage({
  //       path: menu.to,
  //       component: menu.component
  //         ? `${__dirname}/${menu.component}`
  //         : `${__dirname}/src/templates/archive/index.tsx`
  //     })
  //   }
  // })

  const [ developPostedEdged, contentfulData ] = await Promise.all([
    getFilePostedData('development', graphql, reporter),
    getContentfulData(graphql, reporter),
  ])
  
  const categorizedDevelop = sortingCategorizing(developPostedEdged)
  const developMenu = makeMenus({ to: '/development', label: 'Development' }, categorizedDevelop, createPage)

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

const makeMenus = (menu, categorized, createPage) => {
  const subMenus = []
  for (let categoryName of Object.keys(categorized)) {
    const category = categorized[categoryName]
    subMenus.push({
      to: `/${category.path}`,
      label: categoryName,
      component: `${__dirname}/src/templates/archive/index.tsx`,
      context: {
        nodeCategory: 'development',
        nodePath: category.path
      }
    })
  }
  menu.subMenu = subMenus

  const mlist = []
  mlist.push(menu)

  mlist.forEach(menu => {
    if (menu.subMenu) {
      menu.subMenu.forEach(subMenu => {
        createPage({
          path: subMenu.to,
          component: subMenu.component,
          context: subMenu.context
        })
      })
    } else {
      createPage({
        path: menu.to,
        component: menu.component,
        context: menu.context
      })


    }
  })
  return mlist
}

const sortingCategorizing = (edges) => {
  const categoryMap = {}
  edges.forEach(edge => {
    const categories = edge.node.childMdx.frontmatter.categoryNames
    const totalCategories = categories.length
    const article = edge.node.childMdx
    searchAndAppendCategory(0, categories, categoryMap, article)
  })
  return categoryMap
}

const searchAndAppendCategory = (index, categories, categoryMap, article) => {
  const totalCategory = categories.length
  const currentCategory = categories[index]

  let done = false;
  for (let writtenCategory of Object.keys(categoryMap)) {
    const writtenCategoryMap = categoryMap[writtenCategory]
    if (writtenCategory === currentCategory) {
      // * 존재
      if ((index + 1) < totalCategory) {
        searchAndAppendCategory(index + 1, categories, writtenCategoryMap.sub, article)
        done = true
      } else {
        writtenCategoryMap.path = article.frontmatter.category
        writtenCategoryMap.list.push(article)
        return
      }
    }
  }
  if (!done) {
    // * 비존재
    if ((index + 1) < totalCategory) {
      categoryMap[currentCategory] = createNewCategory()
      categoryMap[currentCategory].path = article.frontmatter.category
      categoryMap[currentCategory].list.push(article)
      searchAndAppendCategory(index + 1, categories, categoryMap[currentCategory].sub, article)
    } else {
      categoryMap[currentCategory] = createNewCategory()
      categoryMap[currentCategory].path = article.frontmatter.category
      categoryMap[currentCategory].list.push(article)
      return
    }
  }
}

const createNewCategory = () => {
  return { path: '/', sub: {}, list: [] }
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
