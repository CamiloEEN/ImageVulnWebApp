import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Explore.css';

function Explore() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/explore/posts/", {
      credentials: "include", // incluye cookies
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);


  return (
    <>
      <Navbar />
      <div className="explore-container">
        <h1>Explora imágenes públicas</h1>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Footer />
    </>
  );
}

function PostCard({ post }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Cargar likes y comentarios
  useEffect(() => {
    fetch(`http://localhost:8000/explore/likes/count/?post_id=${post.id}`)
      .then((res) => res.json())
      .then((data) => setLikes(data.count));

    fetch(`http://localhost:8000/explore/comments/?post_id=${post.id}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [post.id]);

  // Manejar nuevo comentario (❗ XSS y CSRF)
  const handleCommentSubmit = () => {
    fetch("http://localhost:8000/explore/comments/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: post.id,
        content: newComment,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments([...comments, data]); // no se limpia
        setNewComment(""); // no sanitizamos el input
      });
  };

  // Dar like (❗ sin validar sesión + vulnerable a CSRF)
  const handleLike = () => {
    fetch("http://localhost:8000/explore/likes/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: post.id,
      }),
    })
      .then((res) => res.json())
      .then(() => setLikes((prev) => prev + 1));
  };

  return (
    <div className="post-card" style={{ border: "1px solid gray", margin: "1em", padding: "1em" }}>
      <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
      <p dangerouslySetInnerHTML={{ __html: post.descrition }} />
      {post.image_filename && (
        <img
          src={`http://localhost:8000/edited_images/${post.image_filename}`}
          alt="Imagen publicada"
          style={{ width: "300px", border: "1px solid black" }}
        />
      )}

      <div>
        <button onClick={handleLike}>❤️ Like ({likes})</button>
      </div>

      <div>
        <h4>Comentarios</h4>
        <ul>
          {comments.map((comment, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: comment.content }} />
          ))}
        </ul>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario (se permiten scripts 😈)"
        />
        <button onClick={handleCommentSubmit}>Enviar comentario</button>
      </div>
    </div>
  );
}

export default Explore;