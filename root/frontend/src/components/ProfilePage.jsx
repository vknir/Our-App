import { useParams } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Profile from './Profile.jsx'

function ProfilePage(params) {
    const {username} = useParams();
    return <>
    <Header/>
    {username}
    <Footer/>
    </>
}

export default ProfilePage;