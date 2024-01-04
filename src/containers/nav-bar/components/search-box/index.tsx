import { useAppDispatch } from "#app/hooks"
import { searchDirs } from "#containers/nav-bar/nav-bar.slice"
import { debounce } from "#utils/debounce"

export const SearchBox = () => {
  const dispatch = useAppDispatch()

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searchDirs(e.target.value))
  }, 300)

  return (
    <div className="navbar-item">
      <input 
        className="navbar-search-text" 
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
      />
    </div>
  )
}