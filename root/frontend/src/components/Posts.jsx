import { NavLink } from "react-router-dom";
import { feedStateFamily } from "../store/atom";
import { useRecoilState } from "recoil";

import "./style/Posts.css";

//STACKOVERFLOW CODE
// https://stackoverflow.com/questions/13459866/javascript-change-date-into-format-of-dd-mm-yyyy
function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}

function Posts({ _id }) {
  const [feed, setFeed] = useRecoilState(feedStateFamily(_id));
  const { postInfo, userInfo } = feed;
  const title = postInfo.title;
  const username = userInfo.username;

  const date = convertDate(postInfo.date);

  return (
    <NavLink>
      <div className="posts">
        <div className="user-pfp"></div>
        <p>
          <span> {title + " "}</span>
          by {username + "  "}
          on {" " + date}
        </p>
      </div>
    </NavLink>
  );
}

export default Posts;
