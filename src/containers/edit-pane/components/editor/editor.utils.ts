import { IFileContent, ITab } from "#containers/edit-pane/edit-pane.interface"

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

export const updateFileContentById = (
  fileContents: IFileContent[],
  showedTabs: ITab[],
  id: string,
  isDraft: boolean,
  draftContent: string
): {
  newFileConents: IFileContent[],
  newShowedTabs: ITab[]
} => {
  const contentIndex = fileContents.findIndex(fileContent => fileContent.id === id)
  const tabIndex = showedTabs.findIndex(tab => tab.id === id)

  if (contentIndex !== -1) {
    const newFileConents = [ ...fileContents ]
    const newShowedTabs = [ ...showedTabs ]
    const newFileContent = { ...newFileConents[contentIndex], draftContent }

    if (isDraft) {
      newFileConents[contentIndex] = newFileContent
      newShowedTabs[tabIndex].isUnsaved = newFileContent.content !== draftContent
    } else if (newFileContent.content !== newFileContent.draftContent) {
        newFileConents[contentIndex] = { ...newFileContent, content: newFileContent.draftContent } 
        newShowedTabs[tabIndex] = { ...newShowedTabs[tabIndex], isUnsaved: false }
    }

    return { newFileConents, newShowedTabs }
  }

  return { newFileConents: fileContents, newShowedTabs: showedTabs }
}