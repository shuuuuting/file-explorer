export interface ITab {
  id: string
  name: string
  isUnsaved: boolean
}

export interface IFileContent {
  id: string
  draftContent: string
  content?: string
}