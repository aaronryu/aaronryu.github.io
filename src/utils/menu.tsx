import { Menu } from "../components/menubar/navigator"
import { CategorizedNodes } from "./categorizer"

const makeMenus = (headerNenu: Menu, categorizedMap: Map<string, CategorizedNodes>): Array<Menu> => {
  const subMenus = []
  for (let eachCategoryName of Object.keys(categorizedMap)) {
    const category = categorizedMap.get(eachCategoryName)!
    subMenus.push({
      to: `/${category.path}`,
      label: eachCategoryName,
      component: `${__dirname}/src/templates/archive/index.tsx`,
      context: {
        nodeCategory: 'development',
        nodePath: category.path
      }
    })
  }
  headerNenu.subMenu = subMenus
  return [ headerNenu ]
}

export {
  makeMenus,
}
