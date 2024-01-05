interface Tree<T> {
  id: string
  children: T[]
}

export function getNodeById<T extends Tree<T>>(node: T, id: string): (T | undefined) {
  if (node.id === id) {
    return node
  } 
  
  if (node.children) {
    for (const child of node.children) {
      const target = getNodeById(child, id)
      if (target) return target
    }
  }

  return undefined
}