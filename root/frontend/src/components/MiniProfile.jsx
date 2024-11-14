import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";

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
          <Link to={'/profile/'+miniProfile.username}>
            <img className="pfp" src={miniProfile.pfp}></img>
            <h2>{miniProfile.username}</h2>
            </Link>
          </div>
         
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default MiniProfile;
