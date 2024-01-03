import { IFileContent, ITab } from "#containers/edit-pane/edit-pane.interface"

export const updateTabNameById = (
  showedTabs: ITab[],
  id: string,
  newName: string,
): ITab[] => {
  const index = showedTabs.findIndex(tab => tab.id === id)

  if (index !== -1) {
    showedTabs[index] = { ...showedTabs[index], name: newName } 
  }

  return showedTabs
}

export const pruneTabById = (showedTabs: ITab[], id: string): ITab[] => {
  const pruneIndex = showedTabs.findIndex(tab => tab.id === id)

  if (pruneIndex !== -1) {
    showedTabs.splice(pruneIndex, 1)
  } 

  return showedTabs
}

export const updateFileContentById = (
  fileContents: IFileContent[],
  id: string,
  newContent: string,
): IFileContent[] => {
  const index = fileContents.findIndex(fileContent => fileContent.id === id)

  if (index !== -1) {
    fileContents[index] = { ...fileContents[index], content: newContent } 
  }

  return fileContents
}