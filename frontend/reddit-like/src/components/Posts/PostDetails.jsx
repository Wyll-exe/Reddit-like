import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../Sidebar/Sidebar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostDetails() {
  const { documentId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const UserId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    fetchPostDetails();
  }, [documentId]);

  async function fetchPostDetails() {
    try {
      const res = await axios.get(
        `http://localhost:1337/api/posts/${documentId}?populate=author,media`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setPost(res.data.data);

        const commentsRes = await axios.get(
          `http://localhost:1337/api/comments?filters[comments][documentId][$eq]=${documentId}&populate=author`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (commentsRes.status === 200) {
          setComments(commentsRes.data.data);
        } else {
          throw new Error("Erreur lors de la récupération des commentaires");
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

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
        setComments((prev) => [...prev, res.data.data]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire :", err);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await axios.delete(`http://localhost:1337/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      toast.warning("Vous ne pouvez pas supprimer ce commentaire !");
    }
  }

  async function handleUpdateComment(commentId, updatedText) {
    try {
      const res = await axios.put(
        `http://localhost:1337/api/comments/${commentId}`,
        {
          data: {
            author: UserId,
            post: post.id,
            Description: updatedText,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setComments((prev) =>
          prev.map((c) => (c.documentId === commentId ? res.data.data : c))
        );
        setEditCommentId(null);
      }
    } catch (err) {
      toast.warning("Vous ne pouvez pas modifier ce commentaire !");
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Chargement...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-600">{error.message}</p>
      </div>
    );

  return (
    <div className="p-4 max-w-3xl mx-auto ml-64">
      {post && (
        <div className="mb-6">
          <h3 className="text-sm mb-1 text-gray-500">
            @{post.author?.username || "Anonyme"}
          </h3>
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="mb-4">{post.description}</p>
          {post.media?.[0]?.url && (
            <img
              src={`http://localhost:1337${post.media[0].url}`}
              alt="Illustration"
              className="w-full rounded-lg"
            />
          )}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Commentaires</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.documentId} className="mb-4 p-3 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-semibold text-violet-600">
                @{comment.author?.username || "Anonyme"}
              </h4>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>

              {editCommentId === comment.documentId ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateComment(comment.documentId, editCommentText);
                  }}
                >
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="w-full mt-2 p-2 border rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditCommentId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-1">{comment.Description}</p>
              )}

              {(UserId === comment.author?.id || UserId === post.author?.id) && editCommentId !== comment.documentId && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDeleteComment(comment.documentId)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Supprimer
                  </button>
                  {UserId === comment.author?.id && (
                    <button
                      onClick={() => {
                        setEditCommentId(comment.documentId);
                        setEditCommentText(comment.Description);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Modifier
                    </button>
                  )}
                </div>
              )}
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
          className="w-full p-3 border rounded"
          rows="3"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter un commentaire
        </button>
      </form>
      <Sidebar />
      <ToastContainer />
    </div>
  );
}

