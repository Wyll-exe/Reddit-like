import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

export default function ModifierPost () {
    const { id } = useParams();
    const [supprimer, setSupprimer] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    let navigate = useNavigate();
    

    async function fetchSupprimer() {
        setLoading(true)
        try {
            const url = `http://localhost:1337/api/posts/${id}`


            const response = await fetch(url)
            if (!response.ok) {
                throw new Error("pas de post trouvé")
            }


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
      }

  return (
    <div>
            <div>Page pour modifier</div>
             {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {supprimer && (
                <div>
                    <div>
                    <p>{supprimer.title}</p>
                    <p>{supprimer.description}</p>
                    </div>
                <button onClick={deletePost}>Supprimer</button>
                </div>
            )}
        </div>
    )
}