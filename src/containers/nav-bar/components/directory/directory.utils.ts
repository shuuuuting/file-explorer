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

export const traverseAndModify = (
  node: IDirectory, 
  key: string, 
  generateNewData: () => any
): IDirectory => {
  const updatedNode = { ...node } 
  updatedNode[key] = generateNewData() 
  console.log(updatedNode)

  updatedNode.children = node.children.map(child => 
    traverseAndModify(child, key, generateNewData))

  return updatedNode
}

export const updateDirNameById = (
  root: IDirectory,
  id: string,
  newName: string
): IDirectory => {
  let newRoot = { ...root }
  if (newRoot.id === id) {
    newRoot.name = newName
    if (newRoot.type !== DirType.FOLDER) {
      newRoot.type = getFileType(newName)
    }
  } else {
    newRoot.children.forEach((child: IDirectory) => {
      updateDirNameById(child, id, newName)
    })
  }

  return newRoot
}

export const insertNewDir = (
  root: IDirectory,
  parentId: string,
  newDir: IDirectory
): IDirectory => {
  let newRoot = { ...root }
  if (newRoot.id === parentId) {
    const insertIndex = newRoot.children.findIndex(child =>
      newDir.name < child.name
    )
    
    if (insertIndex === -1) {
      newRoot.children.push(newDir)
    } else {
      newRoot.children.splice(insertIndex, 0, newDir)
    }
  } else {
    newRoot.children.forEach((child: IDirectory) => {
      insertNewDir(child, parentId, newDir)
    })
  }

  return newRoot
}

export const pruneDirById = (root: IDirectory, id: string): IDirectory => {
  let newRoot = { ...root }
  const pruneIndex = newRoot.children.findIndex(child => child.id === id)

  if (pruneIndex !== -1) {
    newRoot.children.splice(pruneIndex, 1)
  } else {
    newRoot.children.forEach((child: IDirectory) => {
      pruneDirById(child, id)
    })
  }

  return newRoot
}

export const filterDirs = (root: IDirectory, term: string): IDirectory | undefined => {
  if (root.name.includes(term)) { 
    return {
      ...root,
      children: root.children.map(child => 
        filterDirs(child, term)).filter(Boolean) as IDirectory[]
    }
  } 

  const filteredChildren = root.children.map(child => 
      filterDirs(child, term)).filter(Boolean) as IDirectory[]
  
  if (filteredChildren.length > 0) {
    return { ...root, children: filteredChildren }
  }
  
  return undefined
}