import { DirType } from "./directory.config"

export interface IDirectory {
  id: string
  name: string
  type: DirType
  children: IDirectory[]
}