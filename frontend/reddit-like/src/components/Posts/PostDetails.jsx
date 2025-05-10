import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PostDetails() {
  const { documentId } = useParams(); // Récupère le documentId depuis l'URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Fonction pour récupérer les détails du post via documentId
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

      if (res.status === 200 && res.data.data.length > 0) {
        setPost(res); // Récupère le premier post correspondant
        console.log("Post récupéré :", res.data.data[0]);
        setComments(res.data.data[0].attributes.comments || []);
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
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:1337/api/comments`,
        {
          data: {
            Description: newComment,
            post: post.id, // Associe le commentaire au post
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
        setNewComment(""); // Réinitialise le champ de commentaire
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire :", err);
    }
  }

  // Charge les détails du post au montage du composant
  useEffect(() => {
    fetchPostDetails();
  }, [documentId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error.message}</p>;

  return (
    <div className="p-4">
      {post && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-gray-700">{post.description}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold">Commentaires</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-3 border-b border-gray-200">
              <p>{comment.attributes.Description}</p>
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