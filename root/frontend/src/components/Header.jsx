import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faComment,
  faUser,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import "./style/Header.css";
import { NavLink } from "react-router-dom";

import Loading from "./Loading.jsx";

import { loginState, loadingState } from "../store/atom.js";
import { useEffect } from "react";

function Header() {
  const [login, setLogin] = useRecoilState(loginState);
  const [loading, setLoading] = useRecoilState(loadingState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target[0].value;
    const password = e.target[1].value;

    setLoading(true);
    const loginResponse = await axios.post(
      "https://our-app-7k9z.onrender.com/user/login",
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (loginResponse.data.status === 200) {
      localStorage.setItem("token", `${loginResponse.data.token}`);
      setLogin(true);
    }
    else{
      alert('Invalid credentials')
      e.target[0].value='';
      e.target[1].value='';
    }
    setLoading(false);
  };

  const handleClickSignOut = () => {
    localStorage.removeItem("token");
    setLogin(false);
  };

  useEffect(()=>{
    async function checkLocalStorage() {
       const loginResponse= await axios.get("https://our-app-7k9z.onrender.com/user/exists",{
        headers:{
          Authorization: localStorage.getItem('token')
        }
       })
      
       if(loginResponse.data.status === 200)
       {
        setLogin(true)
       }
      setLoading(false) 
    }

    checkLocalStorage();
    setLoading(true)
   
  },[])

  return (
    <>
     
      {loading ? <Loading /> : <></>}
      <nav>
        <div className="left-section">
          <NavLink to="/">
            <p>OurApp</p>
          </NavLink>
        </div>

        <div className="right-section">
          {login ? (
            <div className="button-wrapper">
              <FontAwesomeIcon icon={faSearch} color="white" />
              <FontAwesomeIcon icon={faComment} color="white" />
              <FontAwesomeIcon icon={faUser} color="white" />
              <button className="clr-success">Create Post</button>
              <button
                className="clr-signout"
                onClick={() => handleClickSignOut()}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Username"></input>
              <input type="password" placeholder="Password"></input>
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </>
  );
}

export default Header;
