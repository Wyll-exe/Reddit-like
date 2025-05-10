import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ModifierPost() {
  const { id } = useParams(); // Récupère l'ID du post depuis l'URL
  const [post, setPost] = useState({ title: '', description: '' }); // État pour le post
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État pour les erreurs
  const [error2, setError2] = useState({}); // État pour les erreurs de formulaire
  const navigate = useNavigate(); // Navigation
  const token = localStorage.getItem('token'); // Récupère le token

  // Redirige si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!token) {
      alert('Vous devez être connecté pour modifier un post');
      navigate('/login');
    }
  }, [token, navigate]);

  // Fonction pour récupérer les données du post
  async function fetchPost() {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:1337/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        const data = res.data.data;
        setPost({
          title: data.attributes.title,
          description: data.attributes.description,
        });
      } else {
        throw new Error('Post introuvable');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  // Charge les données du post au montage du composant
  useEffect(() => {
    fetchPost();
  }, [id]);

  // Gestion des changements dans le formulaire
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation du formulaire
    let formError = {};
    if (!post.title) formError.title = 'Le titre est requis';
    if (!post.description) formError.description = 'La description est requise';

    if (Object.keys(formError).length > 0) {
      setError2(formError);
      return;
    }

    // Mise à jour du post
    try {
      const res = await axios.put(
        `http://localhost:1337/api/posts/${id}`,
        {
          title: post.title,
          description: post.description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert('Votre post a été modifié avec succès !');
        navigate('/homepage');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du post :', err);
      setError(err);
    }
  };

  // Affichage du composant
  return (
    <div>
      <h1>Modifier le post</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600">{error.message}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Titre :</label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleChange}
              className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
            />
            {error2.title && <p className="text-red-600">{error2.title}</p>}
          </div>

          <div>
            <label htmlFor="description">Description :</label>
            <textarea
              id="description"
              name="description"
              value={post.description}
              onChange={handleChange}
              className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
              rows="4"
            ></textarea>
            {error2.description && (
              <p className="text-red-600">{error2.description}</p>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
          >
            Modifier
          </button>
        </form>
      )}
    </div>
  );
}