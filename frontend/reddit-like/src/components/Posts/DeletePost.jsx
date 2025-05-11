import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';

export default function SupprimerPost() {
  const { id } = useParams();
  const [supprimer, setSupprimer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function fetchSupprimer() {
    setLoading(true);
    try {
      const url = `http://localhost:1337/api/posts/${id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('pas de post trouvé');
      const data = await response.json();
      setSupprimer(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSupprimer();
  }, []);

  const deletePost = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce post ?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(
        `http://localhost:1337/api/posts/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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

  return (
    <div className="min-h-screen bg-[#e8f4e8]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 min-h-screen">
          <div className="max-w-xl mx-auto mt-10 p-8 bg-[#7c8b7f] shadow-lg rounded-2xl">
            <h2 className="text-3xl font-bold text-[#242424] mb-6 text-center">Suppression du post</h2>

            {loading && <p className="text-center text-gray-700">Chargement...</p>}
            {error && <p className="text-center text-red-500">{error.message}</p>}

            {supprimer && (
              <div className="space-y-6 text-center">
                <div className="bg-[#919fd4f5] p-4 rounded-lg border border-gray-200">
                  <p className="text-lg font-semibold text-[#4a4a4a]">
                    Titre  <span className="block font-normal">{supprimer.title}</span>
                  </p>
                  <p className="text-lg font-semibold text-[#4a4a4a]">
                    Description  <span className="block font-normal">{supprimer.description}</span>
                  </p>
                </div>
                <button
                  onClick={deletePost}
                  className="bg-orange-400 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Supprimer définitivement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
