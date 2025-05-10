import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DeletePost() {
  const { id } = useParams();
  const [post, setPost] = useState({ id: '', title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Vous devez être connecté pour supprimer votre post');
    navigate('/login');
  }

  async function fetchPost() {
    setLoading(true);
    try {
      console.log("ID récupéré depuis useParams :", id);
      const res = await fetch(`http://localhost:1337/api/posts/${id - 1}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Post introuvable');
      const json = await res.json();
      console.log("Réponse de l'API :", json);

      setPost({
        id: json.data.id,
        ...json.data.attributes,
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPost();
  }, []);

  const deletePost = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce post ?')) return;
    try {
      console.log("ID du post à supprimer :", post.id);
      const res = await axios.delete(
        `http://localhost:1337/api/posts/${post.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        alert('Post supprimé avec succès !');
        navigate('/homepage');
      } else {
        throw new Error(`Statut inattendu : ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error.message}</p>;

  return (
    <div>
      <h1>Supprimer le post</h1>
      <div className="mb-4 p-4 border rounded">
        <h2 className="font-bold">{post.title}</h2>
        <p>{post.description}</p>
      </div>
      <button
        onClick={deletePost}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Supprimer
      </button>
    </div>
  );
}