import { DirType } from "./directory.config"

export interface IDirectory {
  [key: string]: any
  id: string
  name: string
  path: string
  type: DirType
  isExpanded: boolean
  isVisible: boolean
  children: IDirectory[]
}