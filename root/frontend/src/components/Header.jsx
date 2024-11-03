import axios from "axios";

import "./Header.css";
import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const username = e.target[0].value;
    const password = e.target[1].value;

   
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

    console.log(loginResponse)
  };

  return (
    <nav>
      <div className="left-section">
        <NavLink to="/">
          <p>OurApp</p>
        </NavLink>
      </div>

      <div className="right-section">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username"></input>
          <input type="password" placeholder="Password"></input>
          <button type="submit">Login</button>
        </form>
      </div>
    </nav>
  );
}

export default Header;
