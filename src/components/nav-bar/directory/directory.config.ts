export enum DirType {
  FOLDER = "folder",
  JS = "js",
  JSON = "json",
  TS = "ts",
  TXT = "txt",
  OTHERS = "others"
}

export const SupportedFileTypes = [
  DirType.JS, 
  DirType.JSON, 
  DirType.TS, 
  DirType.TXT
] as string[]