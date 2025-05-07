import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DeletePost() {
  const { id } = useParams();
  const [post, setPost] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

    async function fetchPost() {
      setLoading(true);
      try {
        console.log(id)
        const res = await fetch(`http://localhost:1337/api/posts/${id}`);
        if (!res.ok) throw new Error('Post introuvable');
        const json = await res.json();
        setPost(json.data.attributes || json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const deletePost = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce post ?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(
        `http://localhost:1337/api/posts/${id}`,
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
  if (error)   return <p className="text-red-600">{error.message}</p>;

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
