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

export const updateDirNameById = (
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
      updateDirNameById(newRoot, id, newDirName)
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
      newDir.name < child.name
    )
    
    if (insertIndex === -1) {
      root.children.push(newDir)
    } else {
      root.children.splice(insertIndex, 0, newDir)
    }
  } else {
    root.children.forEach((newRoot: IDirectory) => {
      insertNewDir(newRoot, parentId, newDir)
    })
  }

  return root
}

export const pruneDirById = (root: IDirectory, id: string): IDirectory => {
  const pruneIndex = root.children.findIndex((child) => child.id === id)

  if (pruneIndex !== -1) {
    root.children.splice(pruneIndex, 1)
  } else {
    root.children.forEach((newRoot: IDirectory) => {
      pruneDirById(newRoot, id)
    })
  }

  return root
}

export const filterDirs = (root: IDirectory, term: string): IDirectory | undefined => {
  if (root.name.includes(term)) { 
    return {
      ...root,
      children: root.children.map((child) => filterDirs(child, term)).filter(Boolean) as IDirectory[]
    }
  } 

  const filteredChildren = root.children.map((child) => filterDirs(child, term)).filter(Boolean) as IDirectory[]
  
  if (filteredChildren.length > 0) {
    return { ...root, children: filteredChildren }
  }
  
  return undefined
}