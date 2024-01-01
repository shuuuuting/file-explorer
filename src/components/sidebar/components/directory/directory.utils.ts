import { DirType, SupportedFileTypes } from "./directory.config"
import { IDirectory } from "./directory.type"

export const getFileType = (fileName: string) => {
  const fileType = fileName.split(".").pop() ?? ""
  return (
    SupportedFileTypes.includes(fileType)
      ? fileType as DirType
      : DirType.OTHERS
  )
}

export const updateDirName = (
  root: IDirectory,
  id: string,
  newDirName: string
): IDirectory => {
  if (root.id === id) {
    root.name = newDirName
    if (root.type !== DirType.FOLDER) {
      root.type = getFileType(newDirName)
    }
  } else {
    root.children.forEach((newRoot: IDirectory) => {
      updateDirName(newRoot, id, newDirName)
    })
  }

  return root
}

export const insertNewDir = (
  root: IDirectory,
  parentId: string,
  newDir: IDirectory
): IDirectory => {
  if (root.id === parentId) {
    const insertIndex = root.children.findIndex((child) =>
      newDir.name.localeCompare(child.name) < 0
    )
    root.children.splice(insertIndex, 0, newDir)
  } else {
    root.children.forEach((newRoot: IDirectory) => {
      insertNewDir(newRoot, parentId, newDir)
    })
  }

  return root
}

export const pruneDir = (root: IDirectory, id: string): IDirectory => {
  const pruneIndex = root.children.findIndex((child) => child.id === id)

  if (pruneIndex !== -1) {
    root.children.splice(pruneIndex, 1)
  } else {
    root.children.forEach((newRoot: IDirectory) => {
      pruneDir(newRoot, id)
    })
  }

  return root
}