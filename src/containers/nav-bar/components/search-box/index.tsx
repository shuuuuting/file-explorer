import { useAppDispatch } from "#app/hooks"
import { searchDirs } from "#containers/nav-bar/nav-bar.slice"

export const SearchBox = () => {
  const dispatch = useAppDispatch()

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dispatch(searchDirs(e.currentTarget.value ?? ""))
    }
  }

  return (
    <div className="navbar-item">
      <input 
        className="navbar-search-text" 
        type="text"
        placeholder="Search..."
        onKeyDown={(e) => handleSearch(e)}
      />
    </div>
  )
}