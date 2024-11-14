import { useRecoilState } from "recoil";
import { useEffect } from "react";
import axios from "axios";

import { loginState, lengthState } from "../store/atom";


function CreatePost() {
  const [login, setLogin] = useRecoilState(loginState);
  const [length, setLength] = useRecoilState(lengthState);

  function checkLength() {
    if (window.innerWidth > 768) setLength(true);
    else setLength(false);
  }

  useEffect(() => {
    checkLength();
    window.addEventListener("resize", checkLength);

    return () => window.removeEventListener("resize", checkLength);
  }, [length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = e.target[0].value;
    const content = e.target[1].value;

    const response = await axios.post(
      "https://our-app-7k9z.onrender.com/user/posts/create",
      {
        title: title,
        content: content,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: localStorage.getItem("token"),
        },
      }
    )

    if (response.data.status == 200) {
      window.location.reload();
      alert('Posted successfully');
      e.target[0].value='';
      e.target[1].value='';
    } else alert('Unable to post');
  };

  return (
    <>
      <main>
        <form className="create-post" onSubmit={handleSubmit}>
          <label>Title</label>
          <input placeholder="Blank post will not be uploaded"></input>
          <label>Body Content</label>
          <textarea placeholder="Blank post will not be uploaded" rows={length ? 12 : 22}></textarea>
          <button type="submit">Save New Post</button>
        </form>
      </main>
    </>
  );
}

export default CreatePost;
