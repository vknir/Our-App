import Header from "./Header";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import Posts from "./Posts";
import './PostPage.css'


function PostPage() {
  const { _id } = useParams();
 
  
  
  return (
    <>
      <Header />
      <main>
        <div className="post-page">
        <Posts _id={_id} singularPost={true} />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PostPage;
