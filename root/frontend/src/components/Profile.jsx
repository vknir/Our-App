import { useRecoilValue, useRecoilState } from "recoil";

import "./style/Profile.css";
import { profileState } from "../store/atom";
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
import axios from "axios";

function Profile({ username }) {
  const followProfile = useRecoilValue(followProfileState);
  const loading = useRecoilValue(loadingState);
  const profile = useRecoilValue(profileState(username));

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
                    {followProfile ? (
                      <button title="Make your profile on gravatar">
                        <a
                          target="_blank"
                          href="https://wordpress.com/log-in/link?client_id=1854&redirect_to=https%3A%2F%2Fpublic-api.wordpress.com%2Foauth2%2Fauthorize%3Fclient_id%3D1854%26response_type%3Dcode%26blog_id%3D0%26state%3D5cd601686fd805d29ca5db2f477e77f06ce2864569e205db3c25756c3b1f74bf%26redirect_uri%3Dhttps%253A%252F%252Fgravatar.com%252Fconnect%252F%253Faction%253Drequest_access_token%26gravatar_from%3Dsignup%26from-calypso%3D1&gravatar_from=signup"
                        >
                          {" "}
                          edit pfp
                        </a>
                      </button>
                    ) : (
                      <>
                        <button>message</button>
                        <button>follow</button>
                      </>
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
