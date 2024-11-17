import { searchState } from "../store/atom";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./style/Search.css";
import { useRef, Suspense } from "react";
import { queryState } from "../store/atom";
import { ErrorBoundary } from "react-error-boundary";
import Loading from "./Loading";

function Search() {
  const [search, setSearch] = useRecoilState(searchState);
  const [query, setQuery] = useRecoilState(queryState(""));
  let clock = useRef();

  function useDebounce(e) {
    clearTimeout(clock);
    clock = setTimeout(() => {
      setQuery(e.target.value);
    }, 1000);
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
      <div className="search-wrapper">
        <div className="search-box">
          <FontAwesomeIcon
            className="magnifying-glass"
            icon={faMagnifyingGlass}
          />

          
            <input
              placeholder="Search for posts or users"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            ></input>
          

          <FontAwesomeIcon
            className="x"
            onClick={() => setSearch(false)}
            icon={faX}
          />
        </div>
      </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default Search;
