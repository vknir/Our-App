import { useRecoilState } from "recoil";
import axios from "axios";

import Loading from "./Loading";
import { loadingState } from "../store/atom";
import { useEffect } from "react";
import { check } from "express-validator";

function Feed() {
  const [loading, setLoading] = useRecoilState(loadingState);

  async function checkFeed() {
    const loginResponse = await axios.get(
      "https://our-app-7k9z.onrender.com/user/feed",
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    return new Promise ( (resolve, reject)=>{
      resolve(loginResponse);
    })
  }

  useEffect(() => {
    setLoading(true);

    checkFeed().then( p=>console.log(p));

    setLoading(false);
  }, []);

  return <>{loading ? <Loading /> : <></>}</>;
}

export default Feed;
