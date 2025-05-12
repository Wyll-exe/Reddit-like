import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import Notification from '../Notification/NotificationComponent';
import '../../style.css';
import Sidebar from '../Sidebar/Sidebar';

export default function ModifierPost () {
    const { documentId } = useParams();
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
            const url = `http://localhost:1337/api/posts/${documentId}?populate=author,media`;

            const response = await fetch(url, {
            headers: {
                  "Authorization": `Bearer ${token}`,
                },
            });
            

            const data = await response.json()
            setSupprimer(data.data)
            console.log(data.data)
            if (data.data.media == null) {
              setImage(null)
            } else {
              setImage(data.data.media[0].url)
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
          `http://localhost:1337/api/posts/${documentId}`,          {
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
        <div className="w-full md:ml-64 py-6 px-4">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Suppression du post</h2>

            {loading && <p className="text-center text-gray-500">Chargement...</p>}
            {error && <p className="text-center text-red-500">{error.message}</p>}
            {supprimer && (
                <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    {supprimer.title}
                  </p>
                  <p className="text-gray-600 mb-3">
                    {supprimer.description}
                  </p>
                  {image && (
                    <img
                      src={`http://localhost:1337${image}`}
                      alt="Illustration"
                      className="w-full h-auto rounded-lg mb-2"
                    />
                  )}
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => navigate('/homepage')}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={deletePost}
                    className="flex-1 bg-red-400 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
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