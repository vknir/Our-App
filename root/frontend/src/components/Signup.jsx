import "./Signup.css";

function Signup() {
  return (
    <main>
      <div className="left-section">
        <h1>Remember Writing?</h1>
        <p>
          Are you sick of short tweets and impersonal "shared" posts that are
          reminiscent of the late 90's email forwards? We believe getting back
          to actually writing is the key to enjoying the internet again.
        </p>
      </div>
      <div className="right-section">
        <form>
          <label htmlFor="Username">Username</label>
          <input id="Username" placeholder="Username" type="text"></input>
          
          <label htmlFor="Email">Email</label>
          <input id='Email' placeholder="you@example.com" type="text"></input>
          
          <label htmlFor="Password">Password</label>
          <input id='Password' placeholder="Create a password" type="password"></input>
          <button>Signup for OurApp</button>
        </form>
      </div>
    </main>
  );
}

export default Signup;
