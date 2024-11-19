import { Link } from "react-router-dom";
import MiniProfile from "./MiniProfile";
import { searchState } from "../store/atom";
import { useRecoilState } from "recoil";

function SearchResult({ content }) {
    const [search, setSearch]= useRecoilState(searchState);
    return (
    <>
      {content.userId != undefined ? (
        <div onClick={()=>setSearch(false)} className="search-post">
            <Link to={`/posts/${content._id}`}>
          <img src={`${content.userId.pfp}`}></img>
          <p className="search-heading">{content.title}</p>
          <p>by {content.userId.username}</p>
          </Link>
        </div>
      ) : (
        <div onClick={()=>setSearch(false)} className="search-profile">
          <Link to={`/profile/${content.username}`}>
            <img src={`${content.pfp}`}></img>
            <p className="search-heading">{content.username}</p>
          </Link>
        </div>
      )}
    </>
  );
}

export default SearchResult;
