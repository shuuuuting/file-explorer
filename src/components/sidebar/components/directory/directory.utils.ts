import { IDirectory } from "./directory.type"

export const insertNewDir = (
  root: IDirectory,
  parentId: string,
  newDir: IDirectory
) : IDirectory => {
  if (root.id === parentId) {
    const insertIndex = root.children.findIndex((child) => 
      newDir.name.localeCompare(child.name) < 0
    )
    root.children.splice(insertIndex, 0, newDir)
    return root
  }

  root.children.map((newRoot: IDirectory) => {
    return insertNewDir(newRoot, parentId, newDir)
  })

  return root
}