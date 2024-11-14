import { useRecoilValue } from "recoil";

import { miniProfileState } from "../store/atom";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import Loading from "./Loading";
import './style/MiniProfile.css'


function MiniProfile({ userid }) {
  const miniProfile = useRecoilValue(miniProfileState(userid));
  
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <div className="mini-profile">
            <img className="pfp" src={miniProfile.pfp}></img>
            <h2>{miniProfile.username}</h2>
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default MiniProfile;
