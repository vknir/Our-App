import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faComment,
  faUser,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import "./style/Header.css";
import { NavLink } from "react-router-dom";

import Loading from "./Loading.jsx";

import { loginState, loadingState, currentUserState } from "../store/atom.js";
import { useEffect } from "react";

function Header() {
  const [login, setLogin] = useRecoilState(loginState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

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
      localStorage.setItem("username", `${username}`);
      setLogin(true);
      const response = await axios.get(
        `https://our-app-7k9z.onrender.com/user/profile/${localStorage.getItem(
          "username"
        )}`
      );

      setCurrentUser(response.data);
    } else {
      alert("Invalid credentials");
      e.target[0].value = "";
      e.target[1].value = "";
    }
    setLoading(false);
  };

  const handleClickSignOut = () => {
    localStorage.clear();

    setLogin(false);
  };

  useEffect(() => {
    async function checkLocalStorage() {
      const loginResponse = await axios.get(
        "https://our-app-7k9z.onrender.com/user/exists",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (loginResponse.data.status === 200) {
        setLogin(true);
        const response = await axios.get(
          `https://our-app-7k9z.onrender.com/user/profile/${localStorage.getItem(
            "username"
          )}`
        );

        setCurrentUser(response.data);
      }
      setLoading(false);
    }

    checkLocalStorage();
    setLoading(true);
  }, []);

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
              {login ? (
                <ErrorBoundary>
                  <Suspense
                    fallback={<FontAwesomeIcon icon={faUser} color="white" />}
                  >
                    <img
                      title={currentUser.username}
                      className="pfp"
                      src={currentUser.pfp}
                    ></img>
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <FontAwesomeIcon icon={faUser} color="white" />
              )}
              <NavLink to="/create">
                <button className="clr-success">Create Post</button>
              </NavLink>
              <NavLink to="/">
                <button
                  className="clr-signout"
                  onClick={() => handleClickSignOut()}
                >
                  Sign Out
                </button>
              </NavLink>
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
