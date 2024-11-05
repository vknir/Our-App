import { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

import "./Signup.css";
import lengthState from "../store/lengthState";

function Signup() {
  const length = useRecoilValue(lengthState);
  const setLength = useSetRecoilState(lengthState);

  function checkLength(){
    if( window.innerWidth > 768)
        setLength(true)
    else
      setLength(false)  
} 




  useEffect(()=>{
      checkLength();
      window.addEventListener('resize', checkLength)

      return ()=> window.removeEventListener('resize', checkLength)
  },[length])

  
  
  return (
    <main>
      <div className="signup-left-section">
        
        {length ? (
          <>
            <h1>Remember Writing?</h1>
            <p>
              Are you sick of short tweets and impersonal "shared" posts that
              are reminiscent of the late 90's email forwards? We believe
              getting back to actually writing is the key to enjoying the
              internet again.
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
        <form>
          <div>
            <label htmlFor="Username">Username</label>
            <input id="Username" placeholder="Username" type="text"></input>
          </div>
          <div>
            <label htmlFor="Email">Email</label>
            <input id="Email" placeholder="you@example.com" type="text"></input>
          </div>
          <div>
            <label htmlFor="Password">Password</label>
            <input
              id="Password"
              placeholder="Create a password"
              type="password"
            ></input>
          </div>
          <button>Signup for OurApp</button>
        </form>
      </div>
    </main>
  );
}

export default Signup;
