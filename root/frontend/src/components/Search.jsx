import { searchState } from "../store/atom";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./style/Search.css";
import { useRef, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Loading from "./Loading";
import { useState } from "react";
import axios from "axios";
import SearchResult from "./SearchResult";

function Search() {
  const [search, setSearch] = useRecoilState(searchState);
  const [query, setQuery]=useState([]);

  let clock = useRef();

  function useDebounce(e) {
    clearTimeout(clock);
    if(e.target.value != ''){
    clock = setTimeout( ()=>{

      axios.post(`https://our-app-7k9z.onrender.com/user/find/`, {text: e.target.value},{
        headers:{
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:localStorage.getItem('token')
        }
      }).then(p=> setQuery(p.data.finalResult))
    } ,1000)
    }
  }

  return (

    <ErrorBoundary fallback={<Loading/>}>
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
                useDebounce(e);
              }}
            ></input>

            <FontAwesomeIcon
              className="x"
              onClick={() => setSearch(false)}
              icon={faX}
            />
          </div>
          <Suspense fallback={<Loading/>}>
          {query.map( (item)=> {
           
            return <SearchResult content={item}  key={item._id}></SearchResult>})}
          </Suspense>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default Search;
