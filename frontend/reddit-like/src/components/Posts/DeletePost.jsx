import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import Notification from '../Notification/NotificationComponent';
import '../../style.css';

export default function ModifierPost () {
    const { id } = useParams();
    const [supprimer, setSupprimer] = useState('')
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
            const url = `http://localhost:1338/api/posts/${id}?populate=*`

            const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json()
            setSupprimer(data)
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
          `http://localhost:1338/api/posts/${id}`,
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
    <div className='pl-[2rem] pt-[1rem]'>
            <h1>Page pour supprimer</h1>
             {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {supprimer && (
                <div>
                    <div>
                    <p>{supprimer.title}</p>
                    <p>{supprimer.description}</p>
                    {supprimer.media && (
                    <div>
                        <img 
                            src={"http://localhost:1338" + supprimer.media[0].url}
                            alt="Illustration" 
                            className="w-full h-auto"
                        />
                    </div>
                  )}
                    </div>
                <button 
                  onClick={deletePost}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                >
                  Supprimer
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
    )
}