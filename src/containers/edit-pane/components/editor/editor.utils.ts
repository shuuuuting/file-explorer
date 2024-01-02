import { IFileContent } from "#containers/edit-pane/edit-pane.type"

export const updateFileContentById = (
  fileContents: IFileContent[],
  id: string,
  newContent: string,
): IFileContent[] => {
  const index = fileContents.findIndex(fileContent => fileContent.id === id)

  if (index !== -1) {
    fileContents[index] = { id, content: newContent } 
  }

  return fileContents
}