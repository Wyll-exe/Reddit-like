import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

export default function ModifierPost () {
    const { id } = useParams();
    const [supprimer, setSupprimer] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    let navigate = useNavigate();
    const token = localStorage.getItem('token');
    

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
          alert('Post supprimé avec succès !');
          navigate('/homepage');
        } else {
          throw new Error(`Statut inattendu : ${res.status}`);
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression : " + err.message);
      }
      }
      console.log(supprimer)

  return (
    <div>
            <div>Page pour supprimer</div>
             {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {supprimer && (
                <div>
                    <div>
                    <p>{supprimer.title}</p>
                    <p>{supprimer.description}</p>
                    {supprimer.media && (
                    <div className="rounded-lg overflow-hidden mb-4">
                        <img 
                            src={"http://localhost:1338" + post.media[0].url}
                            alt="Illustration" 
                            className="w-full h-auto"
                        />
                    </div>
                  )}
                    </div>
                <button onClick={deletePost}>Supprimer</button>
                </div>
            )}
        </div>
    )
}