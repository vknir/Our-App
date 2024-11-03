import axios from "axios";

import "./Header.css";
import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
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
