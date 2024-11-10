import { feedStateFamily } from "../store/atom";
import { useRecoilState } from "recoil";

function Posts({ _id }) {
    const [feed, setFeed] = useRecoilState(feedStateFamily(_id));
  
    return (
      <li>
        {feed.title}
        {feed.content}
      </li>
    );
  }
  



export default Posts;