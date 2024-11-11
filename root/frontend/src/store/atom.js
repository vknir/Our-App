import axios from "axios";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

export const loadingState = atom({
  key: "loading",
  default: false,
});

export const loginState = atom({
  key: "loginState",
  default: false,
});

export const lengthState = atom({
  key: "length",
  default: true,
});

export const postIdState=atom({
  key:'postId',
  default:[]
})



export const currentUser= selector({
  key:'CurrentUserInfo',
  get: async ({get})=>{
    const response = await axios.get('https://our-app-7k9z.onrender.com/user/')
  }
})

export const feedStateFamily = atomFamily({
  key: "feedFamily",
  default: selectorFamily({
    key: "feedSelectorFamily",
    get:
      (_id) =>
      async ({ get }) => {
        const currentPost = await axios.get(
          `https://our-app-7k9z.onrender.com/p/${_id}`,
          {
            headers:{currentPostAuthorization:localStorage.getItem('token')
            }
          }
        );
        
        if (currentPost.error) {
          throw currentPost.error;
        }
        
        const userProfile = await axios.get(`https://our-app-7k9z.onrender.com/user/info/${currentPost.data.post.userId}`)
        // console.log(res.data.post)
        // console.log(userProfile.data.message)

        const res = {
          postInfo: currentPost.data.post,
          userInfo: userProfile.data.message
        }
        
        return res;
      },
  }),
});
