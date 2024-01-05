import { IFileContent, ITab } from "#components/edit-pane/edit-pane.interface"

export const updateTabNameById = (
  showedTabs: ITab[],
  id: string,
  newName: string,
): ITab[] => {
  let newShowedTabs = [ ...showedTabs ]
  const index = newShowedTabs.findIndex(tab => tab.id === id)

  if (index !== -1) {
    newShowedTabs[index] = { ...newShowedTabs[index], name: newName } 
  }

  return newShowedTabs
}

export const pruneTabById = (showedTabs: ITab[], id: string): ITab[] => {
  let newShowedTabs = [ ...showedTabs ]
  const pruneIndex = newShowedTabs.findIndex(tab => tab.id === id)

  if (pruneIndex !== -1) {
    newShowedTabs.splice(pruneIndex, 1)
  } 

  return newShowedTabs
}

export const pruneFileContentById = (
  fileContents: IFileContent[],
  showedTabs: ITab[],
  id: string,
): {
  newFileContents: IFileContent[],
  newShowedTabs: ITab[]
} => {
  let newFileContents = [ ...fileContents ]
  const pruneIndex = newFileContents.findIndex(fileContent => fileContent.id === id)

  if (pruneIndex !== -1) {
    newFileContents.splice(pruneIndex, 1)
  } 

  const newShowedTabs = pruneTabById(showedTabs, id)

  return { newFileContents, newShowedTabs }
}

export const updateFileContentById = (
  fileContents: IFileContent[],
  showedTabs: ITab[],
  id: string,
  isDraft: boolean,
  draftContent: string
): {
  newFileContents: IFileContent[],
  newShowedTabs: ITab[]
} => {
  const contentIndex = fileContents.findIndex(fileContent => fileContent.id === id)
  const tabIndex = showedTabs.findIndex(tab => tab.id === id)

  if (contentIndex !== -1) {
    const newFileContents = [ ...fileContents ]
    const newShowedTabs = [ ...showedTabs ]
    let newFileContent = { ...newFileContents[contentIndex] }

    if (isDraft) {
      newFileContent = { ...newFileContent, draftContent }
      newFileContents[contentIndex] = newFileContent
      newShowedTabs[tabIndex].isUnsaved = newFileContent.content !== draftContent
    } else if (newFileContent.content !== newFileContent.draftContent) {
      newFileContents[contentIndex] = { ...newFileContent, content: newFileContent.draftContent } 
      newShowedTabs[tabIndex] = { ...newShowedTabs[tabIndex], isUnsaved: false }
    }

    return { newFileContents, newShowedTabs }
  }

  return { newFileContents: fileContents, newShowedTabs: showedTabs }
}