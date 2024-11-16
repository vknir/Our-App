import { useRecoilValue, useRecoilState } from "recoil";

import "./style/Profile.css";
import { profileState, loginState } from "../store/atom";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useEffect } from "react";
import Loading from "./Loading";
import {
  loadingState,
  profileDisplayState,
  followProfileState,
} from "../store/atom";
import Posts from "./Posts";
import MiniProfile from "./MiniProfile";

function Profile({ username }) {
  const followProfile = useRecoilValue(followProfileState(username));
  const loading = useRecoilValue(loadingState);
  const profile = useRecoilValue(profileState(username));
  const login = useRecoilValue(loginState);

  const [profileButtons, setProfileButtons] =
    useRecoilState(profileDisplayState);

  const handleButtonClick = (display) => {
    setProfileButtons(display);
  };

  useEffect(() => {
    setProfileButtons({ posts: true, following: false, followers: false });
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main>
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <div className="profile-info">
                <div className="profile-heading">
                  <div className="left-section">
                    <img src={profile.pfp}></img>
                    <p>{profile.username}</p>
                  </div>
                  <div className="right-section">
                    {login ? (
                      (localStorage.getItem("username") == profile.username) ? (
                        <>
                          <button>
                            <a href="https://shorturl.at/8ikKY" target="_blank">
                              Edit Profile Picture
                            </a>
                          </button>
                        </>
                      ) : (
                        <>
                        <button>Message</button>
                        {/* {followProfile } */}
                        </>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="profile-info-buttons">
                  <button
                    onClick={() =>
                      handleButtonClick({
                        posts: true,
                        followers: false,
                        following: false,
                      })
                    }
                  >
                    Posts: {profile.posts.length}
                  </button>
                  <button
                    onClick={() =>
                      handleButtonClick({
                        posts: false,
                        followers: false,
                        following: true,
                      })
                    }
                  >
                    Following: {profile.following.length}
                  </button>
                  <button
                    onClick={() =>
                      handleButtonClick({
                        posts: false,
                        followers: true,
                        following: false,
                      })
                    }
                  >
                    Followers: {profile.followers.length}
                  </button>
                </div>
                <div className="profile-info-display">
                  {profileButtons.posts === true ? (
                    <>
                      {profile.posts.map((_id) => {
                        return <Posts key={_id} _id={_id} />;
                      })}
                    </>
                  ) : profileButtons.following === true ? (
                    <>
                      {profile.following.map((userid) => {
                        return <MiniProfile userid={userid} key={userid} />;
                      })}
                    </>
                  ) : profileButtons.followers === true ? (
                    <>
                      {profile.followers.map((userid) => {
                        return <MiniProfile key={userid} userid={userid} />;
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>
      )}
    </>
  );
}

export default Profile;
