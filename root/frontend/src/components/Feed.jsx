import axios from "axios";
import { useEffect, Suspense } from "react";
import { useRecoilState } from "recoil";
import { ErrorBoundary } from "react-error-boundary";

import { feedStateFamily, postIdState } from "../store/atom";
import Loading from "./Loading";

function Posts({ _id }) {
  const [feed, setFeed] = useRecoilState(feedStateFamily(_id))

  return (
    <div>{feed.title}
    {feed.content}
    </div>
  );
}

function Feed() {
  //

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
    <ErrorBoundary fallback={ <Loading/>}>
      <Suspense fallback={<div>Loading...</div>}>
       <>{  postId.map((item)=> <Posts key={item} _id={item}/>)}</>
      </Suspense>
    </ErrorBoundary>
  );
}

export default Feed;
