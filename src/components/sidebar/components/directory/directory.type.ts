import { DirType } from "./directory.config"

export type IDirectory = {
  id: number
  name: string
  type: DirType
  children: IDirectory[]
}