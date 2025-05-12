import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Sidebar from '../../components/Sidebar/Sidebar';

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

  async function fetchPostDetails() {
    try {
      const res = await axios.get(
        `http://localhost:1337/api/posts/${documentId}?populate=author,media`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setPost(res.data.data);
        console.log(res.data.data)
        console.log(res.data.data.media.url)
        const commentsRes = await axios.get(
          `http://localhost:1337/api/comments?filters[comments][documentId][$eq]=${documentId}&populate=author`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (commentsRes.status === 200) {
          setComments(commentsRes.data.data);
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

  async function handleDeleteComment(documentId) {
    try {
      const res = await axios.delete(`http://localhost:1337/api/comments/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 200) {
        setComments((prevComments) => prevComments.filter((comment) => comment.documentId !== documentId));
      } 
    } catch (err) {
      alert("Vous ne pouvez pas supprimer ce commentaire !");
    }
  }

  async function handleUpdateComment(commentId, updatedText) {
    try {
      const res = await axios.put(
        `http://localhost:1337/api/comments/${commentId}`,
        {
          "data": {
            "Description": updatedText,
          },
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (res.status === 200) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.documentId === commentId ? res.data.data : comment
          )
        );
        setEditCommentId(null);
      }
    } catch (err) {
      alert("Vous ne pouvez pas modifier ce commentaire !");
    }
  }

  if (loading) return <div className="min-h-screen bg-[#e8f4e8] dark:bg-[#111827] flex justify-center items-center"><p className="dark:text-white">Chargement...</p></div>;
  if (error) return <div className="min-h-screen bg-[#e8f4e8] dark:bg-[#111827] flex justify-center items-center"><p className="text-red-600">{error.message}</p></div>;

  return (
    <div className="min-h-screen bg-[#e8f4e8] dark:bg-[#111827]">
      <div className="flex">
        <Sidebar />
        <div className="w-full md:ml-64">
          <div className="max-w-2xl mx-auto py-6 px-4">
            {/* Post redesigné */}
            {post && (
              <div className="mb-5 bg-white dark:bg-[#1f2937] rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="mb-3 border-b dark:border-gray-700 pb-2">
                    <p className="text-md font-bold text-gray-700 dark:text-gray-300">@{post.author?.username || "Anonyme"}</p>
                  </div>
                  
                  <h1 className="text-xl font-bold mb-2 dark:text-white">{post.title}</h1>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{post.description}</p>
                  
                  {post.media && post.media.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden my-3">
                      <img
                        src={`http://localhost:1337${post.media[0].url}`}
                        alt="Illustration"
                        className="w-full h-auto max-h-[450px] object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2 dark:text-white">Commentaires</h2>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div 
                    key={comment.id} 
                    className="bg-[#c8e6c9] dark:bg-[#1f2937] rounded-lg p-3 mb-2 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium dark:text-gray-200">@{comment.author?.username || "Anonyme"}</span>
                      <div>
                        {comment.author?.id === UserId && (
                          <button
                            onClick={() => {
                              setEditCommentId(comment.documentId);
                              setEditCommentText(comment.Description);
                            }}
                            className="bg-[#4caf50] hover:bg-[#388e3c] dark:bg-[#2e7d32] dark:hover:bg-[#1b5e20] text-white px-2 py-1 rounded text-xs mr-2"
                          >
                            Modifier
                          </button>
                        )}
                        {(UserId === post.author?.id || comment.author?.id === UserId) && (
                          <button
                            onClick={() => handleDeleteComment(comment.documentId)}
                            className="bg-[#ff5252] hover:bg-[#d32f2f] dark:bg-[#b71c1c] dark:hover:bg-[#7f0000] text-white px-2 py-1 rounded text-xs"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>

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
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                        ></textarea>
                        <div className="flex gap-2 mt-2">
                          <button type="submit" className="bg-[#4caf50] hover:bg-[#388e3c] dark:bg-[#2e7d32] dark:hover:bg-[#1b5e20] text-white px-2 py-1 rounded">
                            Enregistrer
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditCommentId(null)}
                            className="bg-[#9e9e9e] hover:bg-[#757575] dark:bg-[#616161] dark:hover:bg-[#424242] text-white px-2 py-1 rounded"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="dark:text-gray-300">{comment.Description}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-[#c8e6c9] dark:bg-[#1f2937] rounded-lg p-3 text-center text-gray-700 dark:text-gray-300">
                  Aucun commentaire pour le moment.
                </div>
              )}
            </div>

            <form onSubmit={handleAddComment} className="bg-white dark:bg-[#1f2937] rounded-lg p-4 shadow-sm">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full p-2 border border-green-300 dark:border-green-800 dark:bg-gray-700 dark:text-white rounded-lg"
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-[#4caf50] hover:bg-[#388e3c] dark:bg-[#2e7d32] dark:hover:bg-[#1b5e20] text-white rounded"
              >
                Publier
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}