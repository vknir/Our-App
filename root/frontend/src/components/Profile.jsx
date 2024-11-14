import { useRecoilValue } from "recoil";

import "./style/Profile.css";
import { profileState } from "../store/atom";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import Loading from "./Loading";
import { loadingState } from "../store/atom";

function Profile({ username }) {
  const loading = useRecoilValue(loadingState);
  const profile = useRecoilValue(profileState(username));
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <div className="profile-info">
              <div className="profile-heading">
                <img src={profile.pfp}></img>
                <h1>{profile.username}</h1>
              </div>
              <div className="profile-info-buttons">
                <button>Posts: {profile.posts.length}</button>
                <button>Following: {profile.following.length}</button>
                <button>Followers: {profile.followers.length}</button>
              </div>
            </div>
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}

export default Profile;
