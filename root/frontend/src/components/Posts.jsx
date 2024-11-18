import { Link, NavLink } from "react-router-dom";
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

function Posts({ _id, singularPost }) {
  const [feed, setFeed] = useRecoilState(feedStateFamily(_id));
  const { postInfo, userInfo } = feed;
  const title = postInfo.title;
  const content = postInfo.content;

  const username = userInfo.username;
  const pfp = userInfo.pfp;

  const date = convertDate(postInfo.date);
  

  return (
    <Link to={`/posts/${_id}`}>
      {singularPost ? (
        <>  
          <div className="singular-posts">
            <div className="singular-posts-heading">
              <ErrorBoundary>
                <Suspense
                  fallback={<FontAwesomeIcon icon={faUser} color="white" />}
                >
                  <NavLink to={`/profile/` + username}>
                    <img title={username} className="pfp" src={pfp}></img>
                  </NavLink>
                </Suspense>
              </ErrorBoundary>
              <p className="post-heading-info">
                <span>
                  {" "}
                  {title}
                </span>
                by {username + "  "}
                on {" " + date}
              </p>
            </div>
            <div className="singular-posts-content">
              <p>
                { content}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="posts">
          <div className="posts-heading">
            <ErrorBoundary>
              <Suspense
                fallback={<FontAwesomeIcon icon={faUser} color="white" />}
              >
                <NavLink to={`/profile/` + username}>
                  <img title={username} className="pfp" src={pfp}></img>
                </NavLink>
              </Suspense>
            </ErrorBoundary>
            <p className="post-heading-info">
              <span>
                {" "}
                {title.length > 10 ? `${title.substring(0, 9)} ...` : title}
              </span>
              by {username + "  "}
              on {" " + date}
            </p>
          </div>
          <div className="posts-content">
            <p>
              {content.length > 30
                ? `${content.substring(0, 29)} ...`
                : content}
            </p>
          </div>
        </div>
      )}
    </Link>
  );
}

export default Posts;
