import { useRecoilValue } from "recoil";

import { miniProfileState } from "../store/atom";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import Loading from "./Loading";

function MiniProfile({ userid }) {
  const miniProfile = useRecoilValue(miniProfileState(userid));
  console.log(miniProfile);
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
        {miniProfile.username}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default MiniProfile;
