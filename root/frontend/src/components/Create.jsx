import { useEffect } from "react";
import { useRecoilState } from "recoil";

import Header from "./Header";
import Footer from "./Footer";
import { loginState ,lengthState} from "../store/atom";

import './style/Create.css'

function Create() {
  const [login, setLogin] = useRecoilState(loginState);
  const [length, setLength] =useRecoilState(lengthState)


  function checkLength() {
    if (window.innerWidth > 768) setLength(true);
    else setLength(false);
  }

  useEffect(() => {
    checkLength();
    window.addEventListener("resize", checkLength);
    
    return () => window.removeEventListener("resize", checkLength);
  }, [length]);
  
 
  const handleSubmit = async (e)=>{
    e.preventDefault();
    console.log(e);
  }
  
  return(
  <>
    {login ? (
      <>
        <Header />
        <main>
            <form className="create-post" onSubmit={ handleSubmit}>
                <label >Title</label>
                <input></input>
                <label>Body Content</label>
                <textarea rows={length ? 12: 22 }></textarea>
                <button type="submit">Save New Post</button>
            </form>
        </main>
        <Footer />
      </>
    ) : (
      <>Error</>
    )}
  </>);
}

export default Create;
