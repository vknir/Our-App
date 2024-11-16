import { searchState } from "../store/atom";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./style/Search.css";

function Search() {
  const [search, setSearch] = useRecoilState(searchState);
  return (
    <div className="search-wrapper">
      <div className="search-box">
        <FontAwesomeIcon className="magnifying-glass" icon={faMagnifyingGlass} />
        <input></input>
        <FontAwesomeIcon className="x" onClick={()=>setSearch(false)} icon={faX} />
      </div>
    </div>
  );
}

export default Search;
