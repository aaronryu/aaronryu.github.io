import { Menu } from "../components/menubar/navigator"
import { CategorizedNodes } from "./categorizer"

const makeMenus = (headerNenu: Menu, categorizedMap: Map<string, CategorizedNodes>): Array<Menu> => {
  let subMenus: Array<Menu> = []
  
  categorizedMap.forEach((eachCategory, eachCategoryName, map) => {
    subMenus.push({
      to: `/${eachCategory.path}`,
      label: eachCategoryName,
    })
  })
  headerNenu.subMenu = subMenus
  return [ headerNenu ]
}

export {
  makeMenus,
}
