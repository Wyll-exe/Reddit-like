import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PostDetails() {
  const { documentId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  async function fetchPostDetails() {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:1337/api/posts/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setPost(res.data.data);
        const commentsRes = await axios.get(
          `http://localhost:1337/api/comments?populate=author`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (commentsRes.status === 200) {
          setComments(commentsRes.data.data);
          console.log(commentsRes.data.data);
        } else {
          throw new Error("Erreur lors de la récupération des commentaires");
        }
      } else {
        throw new Error("Post introuvable");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  // Fonction pour ajouter un commentaire
  async function handleAddComment(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:1337/api/comments`,
        {
          data: {
            Description: newComment,
            post: post.id,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setComments((prevComments) => [...prevComments, res.data.data]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire :", err);
    }
  }


  useEffect(() => {
    fetchPostDetails();
  }, [documentId]);

  async function handleDeleteComment(commentId) {
    try {
      const res = await axios.delete(`http://localhost:1337/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 200) {
        // Supprime le commentaire de la liste
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du commentaire :", err);
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error.message}</p>;

  return (
    <div className="p-4 flex flex-col items-center">
      {post && (
        <div className="mb-6 text-center">
          <h3 className="text-sm mb-2">
            @{post.author?.username || "Anonyme"}
          </h3>
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="text-violet-700">{post.description}</p>
        </div>
      )}

      <div className="mb-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Commentaires</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 border-b border-violet-200 flex flex-col"
            >
              <h3 className="text-sm font-semibold text-violet-600">
                @{comment.author?.username || "Anonyme"}
              </h3>
              <p>{comment.Description}</p>
              <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-500 text-sm"
            >
              Supprimer
            </button>
            </div>
          ))
        ) : (
          <p>Aucun commentaire pour le moment.</p>
        )}
      </div>

      <form onSubmit={handleAddComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          rows="4"
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Ajouter un commentaire
        </button>
      </form>
    </div>
  );
}