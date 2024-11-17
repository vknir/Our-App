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

export const postIdState = atom({
  key: "postId",
  default: [],
});

export const currentUserState = atom({
  key: "CurrentUserInfo",

  default: "",
});

export const profileDisplayState = atom({
  key: "profileDisplay",
  default: {
    posts: true,
    following: false,
    followers: false,
  },
});

export const searchState = atom({
  key: "search State",
  default: false,
});

export const queryState = atomFamily({
  key: "query state",
  default: selectorFamily({
    key: "query state selector",
    get:
      (text) =>
      async ({ get }) => {
        const response = await axios.post(
          `https://our-app-7k9z.onrender.com/user/find`,
          {
            text: text,
          },
          { "Content-Type": "application/x-www-form-urlencoded",
            headers: { Authorization: localStorage.getItem("token") } 
          }
        );

        console.log(response);
        return response;
      },
  }),
});

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
            headers: {
              currentPostAuthorization: localStorage.getItem("token"),
            },
          }
        );

        if (currentPost.error) {
          throw currentPost.error;
        }

        const userProfile = await axios.get(
          `https://our-app-7k9z.onrender.com/user/info/${currentPost.data.post.userId}`
        );
        // console.log(res.data.post)
        // console.log(userProfile.data.message)

        const res = {
          postInfo: currentPost.data.post,
          userInfo: userProfile.data.message,
        };

        return res;
      },
  }),
});

export const profileState = atomFamily({
  key: "profile",
  default: selectorFamily({
    key: "profileSelectorFamily",
    get:
      (username) =>
      async ({ get }) => {
        const response = await axios.get(
          `https://our-app-7k9z.onrender.com/user/profile/${username}`
        );

        if (response.error) throw "slector family error";
        return response.data;
      },
  }),
});

export const followProfileState = atomFamily({
  key: "follow profile",
  default: selectorFamily({
    key: "follow profile selectorFamily",
    get:
      (username) =>
      async ({ get }) => {
        const response = await axios.get(
          `https://our-app-7k9z.onrender.com/user/followcheck/${username}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        return response.data.follows;
      },
  }),
});

export const miniProfileState = atomFamily({
  key: "mini profile",
  default: selectorFamily({
    key: "mini profile selector",
    get:
      (userid) =>
      async ({ get }) => {
        const response = await axios.get(
          `https://our-app-7k9z.onrender.com/user/info/${userid}`
        );
        if (response.error) throw "mini profile error";
        return response.data.message;
      },
  }),
});
