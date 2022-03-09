import { NodeDetail } from "../hooks/use-nodes-details"

export interface CategorizedNodes {
  list: Array<NodeDetail>
  path: string
  sub: Map<string, CategorizedNodes>
}

const categorizeNodes = (nodes: Array<NodeDetail>): Map<string, CategorizedNodes> => {
  const categorizedNodeMap = new Map<string, CategorizedNodes>()
  nodes.forEach(node => searchAndAppendCategorizedMap(0, categorizedNodeMap, node))
  return categorizedNodeMap
}

const searchAndAppendCategorizedMap = (index: number, categorizedNodeMap: Map<string, CategorizedNodes>, node: NodeDetail) => {
  const categories = node.frontmatter.categoryNames
  const totalCategory = categories.length
  const currentCategoryName = categories[index]

  let done = false;
  for (let eachCategoryName of Object.keys(categorizedNodeMap)) {
    const writtenCategorizedNodeMap: CategorizedNodes = categorizedNodeMap.get(eachCategoryName)!
    if (eachCategoryName === currentCategoryName) {
      // * 존재
      if ((index + 1) < totalCategory) {
        searchAndAppendCategorizedMap(index + 1, writtenCategorizedNodeMap.sub, node)
        done = true
      } else {
        writtenCategorizedNodeMap.path = node.frontmatter.category
        writtenCategorizedNodeMap.list.push(node)
        return
      }
    }
  }
  if (!done) {
    // * 비존재
    if ((index + 1) < totalCategory) {
      categorizedNodeMap.set(currentCategoryName, {
        list: [ node ],
        path: node.frontmatter.category,
        sub: new Map<string, CategorizedNodes>(),
      })
      searchAndAppendCategorizedMap(index + 1, categorizedNodeMap.get(currentCategoryName)!.sub, node)
    } else {
      categorizedNodeMap.set(currentCategoryName, {
        list: [ node ],
        path: node.frontmatter.category,
        sub: new Map<string, CategorizedNodes>(),
      })
      return
    }
  }
}

export {
  categorizeNodes,
}
