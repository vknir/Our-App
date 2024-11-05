import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faComment, faUser ,faSpinner} from "@fortawesome/free-solid-svg-icons";

import "./Header.css";
import { NavLink } from "react-router-dom";
import "./Header.css";
import loginState from "../store/loginState.js";
import loadingState from "../store/loadingState.js";
import Loading from "./Loading.jsx";

function Header() {
  const login = useRecoilValue(loginState);
  const setLogin = useSetRecoilState(loginState);

  const loading = useRecoilValue(loadingState);
  const setLoading = useSetRecoilState(loadingState);

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

    if (loginResponse.data.status === 200) setLogin(true);
    setLoading(false);
  };

  return (
    <>
      {
        loading?
        <Loading/>
      :<></>
      }
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
              <button className="clr-signout" onClick={() => setLogin(false)}>
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
