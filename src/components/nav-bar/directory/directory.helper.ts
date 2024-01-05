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

export const traverseAndModifyAll = (
  node: IDirectory, 
  key: string, 
  generateNewData: (oldData: any) => any
): IDirectory => {
  const updatedNode = { ...node } 
  updatedNode[key] = generateNewData(updatedNode[key]) 

  updatedNode.children = node.children.map((child: IDirectory) => 
    traverseAndModifyAll(child, key, generateNewData))

  return updatedNode
}

export const traverseAndModifyOne = (
  node: IDirectory, 
  id: string,
  key: string, 
  newData: any
): IDirectory => {
  const updatedNode = { ...node } 
  if (node.id === id) updatedNode[key] = newData

  updatedNode.children = node.children.map(child => 
    traverseAndModifyOne(child, id, key, newData))

  return updatedNode
}

export const replacePathPrefix = (path: string, prefix: string, newPrefix: string) => {
  const regex = new RegExp(`^${prefix}`)
  const newPath = path.replace(regex, newPrefix)
  return newPath
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
    const lastSlashIndex = newRoot.path.lastIndexOf("/")
    const newPrefix = id === "0" ? newName : `${newRoot.path.substring(0, lastSlashIndex)}/${newName}`
    newRoot = traverseAndModifyAll(
      newRoot, "path", (path: string) => replacePathPrefix(path, newRoot.path, newPrefix)
    )
    return newRoot
  } else {
    newRoot.children = newRoot.children.map((child: IDirectory) => 
      updateDirNameById(child, id, newName)
    )
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
    const insertIndex = newRoot.children.findIndex((child: IDirectory) =>
      newDir.name < child.name
    )
    
    if (insertIndex === -1) {
      newRoot.children.push(newDir)
    } else {
      newRoot.children.splice(insertIndex, 0, newDir)
    }
    return newRoot
  } else {
    newRoot.children = root.children.map((child: IDirectory) => 
      insertNewDir(child, parentId, newDir)
    )
  }

  return newRoot
}

export const pruneDirById = (root: IDirectory, id: string): IDirectory => {
  let newRoot = { ...root }
  const pruneIndex = newRoot.children.findIndex(child => child.id === id)

  if (pruneIndex !== -1) {
    newRoot.children.splice(pruneIndex, 1)
    return newRoot
  } else {
    newRoot.children = newRoot.children.map((child: IDirectory) => 
      pruneDirById(child, id)
    )
  }

  return newRoot
}

export const updateVisibility = (node: IDirectory, term: string): IDirectory => {
  // check visibility from children 
  node.children = node.children.map(child => updateVisibility(child, term))

  // any of the children is visible
  if (node.children.some(child => child.isVisible)) {
    node.isVisible = true
    node.isExpanded = true
  }
  // curr node is matched & children are all invisible
  else if (node.name.toLowerCase().includes(term.toLowerCase())) {
    node.isVisible = true
    node.isExpanded = false
  }
  else {
    node.isVisible = false
    node.isExpanded = false
  }

  return node
}