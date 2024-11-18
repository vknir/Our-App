import axios from "axios";
import { useEffect, Suspense } from "react";
import { useRecoilState } from "recoil";
import { ErrorBoundary } from "react-error-boundary";

import { postIdState } from "../store/atom";
import Loading from "./Loading";
import Posts from "./Posts";
import "./style/Feed.css";

function Feed() {
  const [postId, setPostId] = useRecoilState(postIdState);

  useEffect(() => {
    axios
      .get("https://our-app-7k9z.onrender.com/user/feed", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((p) => setPostId(p.data.feed));
  }, []);

  return (
    <main>
      <div className="feed-content">
        {postId.length > 0 ? (
          <ErrorBoundary fallback={<div>Error </div>}>
            <Suspense fallback={<Loading />}>
              <div className="non-zero-following">
                <p className="heading">Latest from those you Follow</p>
                <div className="posts-wrapper">
                  {postId.map((item) => (
                    <Posts key={item} _id={item} singularPost={false} />
                  ))}
                </div>
              </div>
            </Suspense>
          </ErrorBoundary>
        ) : (
          <>
            <div className="zero-following">
              <div className="zero-following-header">
                Hello <span>{localStorage.getItem("username")}</span>, your feed
                is empty.
              </div>
              <p>
                Your feed displays the latest posts from the people you follow.
                If you don't have any friends to follow that's okay; you can use
                the "Search" feature in the top menu bar to find content written
                by people with similar interests and then follow them.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Feed;
