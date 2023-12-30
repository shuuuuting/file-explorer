import { IDirectory } from "./directory.type"
import { MdFolder } from "react-icons/md"
import { MdInsertDriveFile } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi"
import { FiFolderPlus } from "react-icons/fi"
import { FiFilePlus } from "react-icons/fi"
import { FiTrash } from "react-icons/fi"
import { DirType } from "./directory.config"
import { useState } from "react"

export const Directory = ({ data } : { data: IDirectory }) => {
  const [isOpen, setIsOpen] = useState(false)

  return ( 
    <>
      <div className="sidebar-item">
        <span className="sidebar-item-icon">
          { data.type === DirType.FOLDER 
            ? <MdFolder onClick={() => setIsOpen(!isOpen)}/>
            : <MdInsertDriveFile />
          }
        </span>
        <span className="sidebar-item-text">
          {data.name} 
        </span>
        <span className="sidebar-item-action"> 
          <span className="sidebar-item-button">
            <FiEdit2 />
          </span>
          <span className="sidebar-item-button">
            <FiFolderPlus />
          </span>
          <span className="sidebar-item-button">
            <FiFilePlus />
          </span>
          <span className="sidebar-item-button">
            <FiTrash />
          </span>
        </span>
      </div>
      <div style={{ paddingLeft: 6 }}>
        { isOpen && 
          data.children.map((child: IDirectory) => (
            <Directory data={child} key={child.id} />
          ))
        }
      </div>
    </>
  )
}