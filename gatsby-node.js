const { menus } = require("./src/components/menubar/menulist.js");

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

  const [ filePostedEdged, contentfulData ] = await Promise.all([
    getFilePostedData(graphql, reporter),
    getContentfulData(graphql, reporter),
  ])
  const testEdges = [
    {
      "node": {
        "childMdx": {
          "id": "80269d71-d67b-59ba-a033-d4d157e91b8d",
          "slug": "two-principles-on-oop/",
          "frontmatter": {
            "date": "December 30, 2018",
            "title": "0. 객체지향 프로그래밍에서의 제 1, 2 원칙",
            "category": "pattern",
            "categoryNames": [
              "Design Pattern"
            ]
          }
        }
      }
    },
    {
      "node": {
        "childMdx": {
          "id": "02e0add3-3895-55ee-97c8-e8ed76ac925e",
          "slug": "refer-copy-post/",
          "frontmatter": {
            "date": "October 26, 2019",
            "title": "개츠비(Gatsby) 1-1",
            "category": "js",
            "categoryNames": [
              "Gatsby",
            ]
          }
        }
      }
    },
    {
      "node": {
        "childMdx": {
          "id": "02e0add3-3895-55ee-97c8-e8ed76ac925e",
          "slug": "refer-copy-post/",
          "frontmatter": {
            "date": "October 26, 2019",
            "title": "개츠비(Gatsby) 1-2",
            "category": "js",
            "categoryNames": [
              "Gatsby",
            ]
          }
        }
      }
    },
    {
      "node": {
        "childMdx": {
          "id": "02e0add3-3895-55ee-97c8-e8ed76ac925e",
          "slug": "refer-copy-post/",
          "frontmatter": {
            "date": "October 26, 2019",
            "title": "개츠비(Gatsby) 1---1-1",
            "category": "js",
            "categoryNames": [
              "Gatsby",
              "Setup"
            ]
          }
        }
      }
    },
    {
      "node": {
        "childMdx": {
          "id": "02e0add3-3895-55ee-97c8-e8ed76ac925e",
          "slug": "refer-copy-post/",
          "frontmatter": {
            "date": "October 26, 2019",
            "title": "개츠비(Gatsby) 1---1-2",
            "category": "js",
            "categoryNames": [
              "Gatsby",
              "Setup"
            ]
          }
        }
      }
    },
    {
      "node": {
        "childMdx": {
          "id": "02e0add3-3895-55ee-97c8-e8ed76ac925e",
          "slug": "refer-copy-post/",
          "frontmatter": {
            "date": "October 26, 2019",
            "title": "개츠비(Gatsby) 1---2-1",
            "category": "js",
            "categoryNames": [
              "Gatsby",
              "Steak"
            ]
          }
        }
      }
    },
    {
      "node": {
        "childMdx": {
          "id": "c8ea7f44-0c56-576e-a8d6-5c697305bd18",
          "slug": "factory-method-and-abstract-factory-pattern/",
          "frontmatter": {
            "date": "February 22, 2019",
            "title": "2. 팩토리 '메소드' 패턴 & '추상' 팩토리 패턴",
            "category": "pattern",
            "categoryNames": [
              "Design Pattern"
            ]
          }
        }
      }
    },
    {
      "node": {
        "childMdx": {
          "id": "6f2e6361-ae0f-5198-9cef-a3f6e7934e64",
          "slug": "a-introduction-to-design-patterns/",
          "frontmatter": {
            "date": "February 21, 2019",
            "title": "1. '디자인 패턴'이란?",
            "category": "pattern",
            "categoryNames": [
              "Design Pattern",
              "Sibal"
            ]
          }
        }
      }
    }
  ]
  const categorized = sortingCategorizing(testEdges)
  makeMenus(categorized, createPage)

  // sortingCategorizing(filePostedEdged)

  filePostedEdged.forEach(edge => {
    createPage({
      path: edge.node.childMdx.frontmatter.category
        ? `${edge.node.childMdx.frontmatter.category}/${edge.node.childMdx.slug}`
        : `${edge.node.childMdx.slug}`,
      component: `${__dirname}/src/templates/post/index.tsx`,
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

const makeMenus = (categorized, createPage) => {




  const developmentMenu = { to: '/development', label: 'Development' }
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
  developmentMenu.subMenu = subMenus

  const mlist = []
  mlist.push(developmentMenu)

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
}

const sortingCategorizing = (edges) => {
  const categoryMap = {}
  edges.forEach(edge => {
    const categories = edge.node.childMdx.frontmatter.categoryNames
    const totalCategories = categories.length
    const article = edge.node.childMdx
    // console.log(Object.keys(categoryMap))
    searchAndAppendCategory(0, categories, categoryMap, article)
  })
  // console.log(JSON.stringify(categoryMap))
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
              id
              slug
              frontmatter {
                date(formatString: "MMMM D, YYYY")
                title
                category
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
