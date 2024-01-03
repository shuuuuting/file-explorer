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