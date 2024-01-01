import { useAppDispatch } from "#app/hooks"
import { searchDirs } from "../directory/directory.slice"

export const Searchbox = () => {
  const dispatch = useAppDispatch()

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dispatch(searchDirs(e.currentTarget.value ?? ""))
    }
  }

  return (
    <div className="sidebar-item">
      <input 
        className="sidebar-search-text" 
        type="text"
        placeholder="Search..."
        onKeyDown={(e) => handleSearch(e)}
      />
    </div>
  )
}