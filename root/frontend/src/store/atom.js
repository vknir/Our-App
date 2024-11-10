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
        const res = await axios.get(
          `https://our-app-7k9z.onrender.com/p/${_id}`,
          {
            headers:{
                Authorization:localStorage.getItem('token')
            }
          }
        );
        if (res.error) {
          throw response.error;
        }
        
        console.log(res.data.post)
        return res.data.post;
      },
  }),
});
