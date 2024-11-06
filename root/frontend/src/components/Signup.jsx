import { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import axios from "axios";

import "./style/Signup.css";

import Loading from "./Loading";

import { lengthState, loadingState, loginState } from "../store/atom";

function Signup() {
  const [loading, setLoading] = useRecoilState(loadingState);
  const [login, setLogin] = useRecoilState(loginState);
  const [length, setLength] = useRecoilState(lengthState);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function checkLength() {
    if (window.innerWidth > 768) setLength(true);
    else setLength(false);
  }

  useEffect(() => {
    checkLength();
    window.addEventListener("resize", checkLength);

    return () => window.removeEventListener("resize", checkLength);
  }, [length]);

  useEffect(() => {
    async function checkLocalStorage(){
        if( localStorage.getItem('token') !=null)
        {
          const loginResponse = axios.get( "https://our-app-7k9z.onrender.com/user/feed",{
            headers:{
              Authorization:localStorage.getItem('token')
            }
          })
          console.log(loginResponse)
        }
    }
      window.addEventListener('storage', checkLocalStorage)
    
     return ()=> window.removeEventListener('storage', checkLocalStorage)
  }, []);

  async function handleClick(e) {
    e.preventDefault();

    setLoading(true);
    const loginResponse = await axios.post(
      "https://our-app-7k9z.onrender.com/user/sign-up",
      {
        username: username,
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (loginResponse.data.status === 200) {
      setLogin(true);
      localStorage.setItem("token", `${loginResponse.data.token}`);
    }
    setLoading(false);
  }

  return (
    <>
      {console.log("in signup " + login)}

      {loading ? <Loading /> : <></>}
      <main>
        <>
          <div className="signup-left-section">
            {length ? (
              <>
                <h1>Remember Writing?</h1>
                <p>
                  Are you sick of short tweets and impersonal "shared" posts
                  that are reminiscent of the late 90's email forwards? We
                  believe getting back to actually writing is the key to
                  enjoying the internet again.
                </p>
              </>
            ) : (
              <>
                <p>Sign Up!</p>
                <p></p>
              </>
            )}
          </div>
          <div className="signup-right-section">
            <form onSubmit={handleClick}>
              <div>
                <label htmlFor="Username">Username</label>
                <input
                  onChange={(event) => {
                    setUserName(event.target.value);
                  }}
                  id="Username"
                  placeholder="Username"
                  type="text"
                ></input>
              </div>
              <div>
                <label htmlFor="Email">Email</label>
                <input
                  id="Email"
                  placeholder="you@example.com"
                  type="text"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                ></input>
              </div>
              <div>
                <label htmlFor="Password">Password</label>
                <input
                  id="Password"
                  placeholder="Create a password"
                  type="password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                ></input>
              </div>
              <button>Signup for OurApp</button>
            </form>
          </div>
        </>
      </main>
    </>
  );
}

export default Signup;
