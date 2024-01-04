import { DirType } from "./directory.config"

export interface IDirectory {
  [key: string]: any
  id: string
  name: string
  type: DirType
  children: IDirectory[]
}