import { NavLink } from "react-router-dom";
import { feedStateFamily } from "../store/atom";
import { useRecoilState } from "recoil";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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
  const content = postInfo.content;

  const username = userInfo.username;
  const pfp = userInfo.pfp;

  const date = convertDate(postInfo.date);

  return (
    <div className="posts">
      <div className="posts-heading">
        <ErrorBoundary>
          <Suspense fallback={<FontAwesomeIcon icon={faUser} color="white" />}>
            <img title={username} className="pfp" src={pfp}></img>
          </Suspense>
        </ErrorBoundary>
        <p className="post-heading-info" >
          <span> {title }</span>
          by {username + "  "}
          on {" " + date}
        </p>
      </div>
      <div className="posts-content">
        <p>
        {content.length > 45 
        ? `${content.substring(0, 45)} ...`
        : content}
        </p>
      </div>
    </div>
  );
}

export default Posts;
