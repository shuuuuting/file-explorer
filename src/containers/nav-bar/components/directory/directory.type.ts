import { DirType } from "./directory.config"

export type IDirectory = {
  id: string
  name: string
  type: DirType
  children: IDirectory[]
}