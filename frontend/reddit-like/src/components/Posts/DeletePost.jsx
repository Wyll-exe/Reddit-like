import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import Notification from '../Notification/NotificationComponent';
import '../../style.css';
import Sidebar from '../Sidebar/Sidebar';

export default function ModifierPost () {
    const { id } = useParams();
    const [supprimer, setSupprimer] = useState('')
    const [image, setImage] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [notification, setNotification] = useState({
        message: '',
        type: '',
        isVisible: false
    });
    
    let navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const showNotification = (type, message) => {
        setNotification({
            message,
            type,
            isVisible: true
        });
    };
    
    const closeNotification = () => {
        setNotification(prev => ({
            ...prev,
            isVisible: false
        }));
    };


    async function fetchSupprimer() {
        setLoading(true)
        try {
            const url = `http://localhost:1337/api/posts/${id}?populate=*`

            const response = await fetch(url, {
            headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
            });
            

            const data = await response.json()
            setSupprimer(data)
            if (data.media == null) {
              setImage(null)
            } else {
              setImage(data.media[0].url)
            }
        } catch (error) {
            setError(error)
            return
        } finally {
            setLoading(false)
        }}

    useEffect(() => {
      fetchSupprimer()
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
          showNotification('success', 'Post supprimé avec succès !');
          setTimeout(() => navigate('/homepage'), 2500);
        } else {
          throw new Error(`Statut inattendu : ${res.status}`);
        }
      } catch (err) {
        console.error(err);
        showNotification('error', "Erreur lors de la suppression : " + err.message);
      }
    }

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
                      {image && (
                      <img
                      src={`http://localhost:1337${image}`}
                      alt="Illustration"
                      className="w-full h-auto"
                      />
                    )}
                </div>
                <button
                  onClick={deletePost}
                  className="bg-orange-400 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Supprimer définitivement
                </button>
                </div>
            )}
            
            <Notification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={closeNotification}
            />
            </div>
          </div>
        </div>
        </div>
    )
  }