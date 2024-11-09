import axios from "axios";
import { useEffect, Suspense  } from "react";
import { useRecoilState } from "recoil";


import { feedStateFamily, postIdState } from "../store/atom";
import Loading from './Loading'

function Posts({_id})
{
 
  const [feed, setFeed] = useRecoilState(feedStateFamily(_id))
 
  return <Suspense fallback={<Loading/>}>
    <li>{'kaka'}</li>
  </Suspense>
  
}

function Feed()
// 

{

  const [postId, setPostId]=useRecoilState(postIdState)

  useEffect(()=>{
    axios.get('https://our-app-7k9z.onrender.com/user/feed',{
      headers:{
        Authorization:localStorage.getItem('token')
      }
    })
    .then(p=> setPostId(p.data.feed))
  },[])

  return <>{postId.map((item)=><Posts key={item} _id={item}/>)}</>
}

export default Feed;