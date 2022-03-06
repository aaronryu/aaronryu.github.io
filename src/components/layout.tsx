/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import Header from "./header"
import { css } from "@emotion/react"
import useSiteMetadata from "../hooks/use-sitemetadata"
import { useEffect, useState } from "react"
import { useRef } from "react"
import Seo, { MetaImage, MetaOption } from "./seo"
import { Global } from "@emotion/react"
import LeftSideMenuBar from "./menubar"
import { Menu } from "./menubar/navigator"
import { graphql, useStaticQuery } from "gatsby"
import { log } from "../utils/logger"

interface Props {
  location: any
  children: React.ReactNode
}

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const MAIN = [
  '/',
]

const PATHNAME_NOW_SHOW_MENU_DEFAULTLY = [
  '/about', '/about/',
  '/404', '/404/',
]
const Layout: React.FunctionComponent<Props> = ({ location, children }) => {

  const home = useStaticQuery(graphql`
  query {
    allFile(
      filter: {
        sourceInstanceName: { eq: "development" }
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
  const categorizedDevelop = sortingCategorizing(home.allFile.edges)
  const developMenu = makeMenus({ to: '/development', label: 'Development' }, categorizedDevelop)

  const isMain = !!(MAIN.find(each => location.pathname.startsWith(each)))
  const isNotArticle = !!(PATHNAME_NOW_SHOW_MENU_DEFAULTLY.find(each => location.pathname.startsWith(each)))

  const menu = developMenu
  // console.log(menu)
  const { title, description, author, deployBranch, linkGithub, linkFacebook, linkTwitter } = useSiteMetadata()
  const spy = useRef() as React.MutableRefObject<HTMLDivElement>;
  const meta: Array<MetaImage | MetaOption> =
    [{ property: 'og:image', content: '/images/cover-todo-change.png' }]
  if (deployBranch !== 'master')
    meta.push({ name: 'robots', content: 'noindex,nofollow' })
  
  // Layout 에서 공통적으로 제목에 해당하는 스크롤
  useEffect(() => {
    if (isMain || isNotArticle) {
      document.body.classList.remove('scrolled-a-bit')
    } else {
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (!entry.intersectionRatio) {
            document.body.classList.add('scrolled-a-bit')
          } else {
            document.body.classList.remove('scrolled-a-bit')
          }
        },
        { rootMargin: '0px' }
      )
      observer.observe(spy.current)
      return observer.disconnect 
    }
  }, [])

  const notShowMenuDefaultly = location ? isNotArticle : true;
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  const [showMenu, setShowMenu] = useState(notShowMenuDefaultly ? false : windowDimensions.width > 1280)
  
  useEffect(() => {
    let mounted = true;
    window.addEventListener('resize', () => {
      if (mounted) {
        const current = getWindowDimensions()
        setWindowDimensions(current)
        const showDefaultWhenWide = current.width > 1280
        if (!notShowMenuDefaultly) {
          setShowMenu(showDefaultWhenWide)
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const close = () => {
    if (windowDimensions.width <= 1280) {
      setShowMenu(false)
    }
  }

  return (
    <>
      <Seo
        lang="en"
        title=""
        meta={meta}
        description={description}
      />
      <Global styles={styles.global} />
      <div css={styles.scrollSpy} ref={spy} />
      <div css={styles.wrapper}>
        <Header siteTitle={title} showMenu={showMenu} toggleShowMenu={() => setShowMenu(!showMenu)} />
        <LeftSideMenuBar location={location.pathname} menu={menu} visible={showMenu} onClose={close} currentWidth={windowDimensions.width} links={{ github: linkGithub, facebook: linkFacebook, twitter: linkTwitter }}  />
        <main css={styles.main}>{children}</main>
        {/* <Footer author={author} /> */}
      </div>
    </>
  )
}

const makeMenus = (menu, categorized) => {
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

  // console.log(mlist)
  return mlist
}

const sortingCategorizing = (edges) => {
  const categoryMap = {}
  // log(() => console.log(edges))
  edges.forEach(edge => {
    // console.log(edge)
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

const styles = {
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Questrial&family=Ubuntu&display=swap');

    html {
      box-sizing: border-box;

      @media only screen and (max-width: 600px) {
        font-size: 0.9rem;
      }
    }
    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }

    body {
      --brand: #5b748b;
      --bg0: white;
      --bg: #f4f7fb;
      --bg-trans: hsla(214, 47%, 97%, 0.7);
      --bg-accents: hsl(215, 47%, 85%, 0.2);
      --bg1: #dee2e6;
      --bg2: #b6bfc8;
      --well: #f8f9fa;
      --card: #ecf1f8;
      --text0: black;
      --text: #2b2836;
      --text-link: #7f5555;
      --text-link-background: #7f555530;
      --text-auxiliary: #535960;
      --text-placeholder: #868e96;
      --hr: hsla(0, 0%, 0%, 0.1);
      --shadow: 0 9px 60px 0 rgba(0, 0, 0, 0.12);
      --shadow-small: 0 5px 10px rgba(0, 0, 0, 0.12);
      --shadow-medium: 0 8px 30px rgba(0, 0, 0, 0.12);
      --shadow-large: 0 30px 60px rgba(0, 0, 0, 0.12);

      font-family:
        'Ubuntu', 'Nanum Gothic', sans-serif,
        -apple-system,
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue', 'Arial',
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      transition: all 0.1s ease-out;
      background-color: var(--bg);
      color: var(--text);
    }

    body.dark {
      --brand: #93a7b9;
      --bg0: black;
      --bg: #2b2836;
      --bg-trans: hsla(253, 15%, 18%, 0.7);
      --bg-accents: hsl(251, 14%, 20%);
      --bg1: #3a3649;
      --bg2: #514c66;
      --well: #23212c;
      --card: #3a3649;
      --text0: white;
      --text: #b6bfc8;
      --text-link: #b79494;
      --text-link-background: #b7949430;
      --text-auxiliary: #848c94;
      --text-placeholder: #868e9688;
      --hr: #3a3649;
      --shadow: 0 9px 60px 0 rgba(0, 0, 0, 0.35);
      --shadow-extra-small: 0 2px 5px rgba(0, 0, 0, 0.35);
      --shadow-small: 0 5px 10px rgba(0, 0, 0, 0.35);
      --shadow-medium: 0 8px 30px rgba(0, 0, 0, 0.35);
      --shadow-large: 0 30px 60px rgba(0, 0, 0, 0.35);
    }

    a {
      text-decoration: none;
      color: var(--text);
    }

    button {
      color: var(--text);
    }
  `,
  scrollSpy: css`
    position: absolute;
    z-index: -999;
    top: 0;
    width: 1px;
    height: 210px;
  `,
  wrapper: css`
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  `,
  main: css`
    position: relative;
    flex: 1;
    margin: 0 auto;
    padding: 0;
    width: 100%;
  `,
}

export default Layout
