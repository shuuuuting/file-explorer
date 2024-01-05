import { useAppDispatch, useAppSelector } from "#app/hooks"
import { saveSearchTerm, searchDirs, selectSearchTerm } from "#containers/nav-bar/nav-bar.slice"
import { debounce } from "#utils/debounce"

export const SearchBox = () => {
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(selectSearchTerm)

  const handleSearch = debounce(() => {
    dispatch(searchDirs())
  }, 500)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(saveSearchTerm(e.target.value))
    handleSearch()
  }

  return (
    <div className="navbar-item">
      <input 
        className="navbar-search-text" 
        type="text"
        value={searchTerm}
        placeholder="Search..."
        onChange={handleChange}
      />
    </div>
  )
}