import { useParams } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Profile from './Profile.jsx'
import { Suspense } from "react";
import Loading from "./Loading.jsx";

function ProfilePage(params) {
    const {username} = useParams();
    return <>
    <Header/>
    <Suspense fallback={<Loading/>}>
        <Profile username={username}/>
    </Suspense>
    <Footer/>
    </>
}

export default ProfilePage;