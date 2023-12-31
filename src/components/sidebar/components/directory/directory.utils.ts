import { DirType } from "./directory.config"
import { IDirectory } from "./directory.type"

export const renameExistingDir = (
  root: IDirectory,
  id: string,
  newDirName: string
) : IDirectory => {
  if (root.id === id) {
    root.name = newDirName
    if (root.type !== DirType.FOLDER) {
      const fileType = newDirName.split(".").pop()
      if (!fileType || !([DirType.JS, DirType.JSON, DirType.TS, DirType.TXT] as string[]).includes(fileType)) {
        root.type = DirType.OTHERS
      } else {
        root.type = fileType as DirType 
      }
    }
    return root
  }

  root.children.map((newRoot: IDirectory) => {
    return renameExistingDir(newRoot, id, newDirName)
  })

  return root
}

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