import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

export default function ModifierPost () {
    const { id } = useParams();
    const [modifier, setModifier] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [updated, setUpdated] = useState(false)
    let navigate = useNavigate();
    

    async function fetchModifier() {
        setLoading(true)
        try {
            const url = `http://localhost:1337/api/posts/${id}`


            const response = await fetch(url)
            if (!response.ok) {
                throw new Error("pas de post trouvé")
            }


            const data = await response.json()
            setModifier(data)
        } catch (error) {
            setError(error)
            return
        } finally {
            setLoading(false)
        }
    }

    const [post, setPost] = useState({
        title: '',
        description: ''
    });

    const [error2, setError2] = useState({}); 


    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({ ...prevPost, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formError = {};
        if (!post.title) formError.society = 'Title est requi';
        if (!post.description) formError.job = 'Description est requise';

        if (Object.keys(formError).length > 0) {
            setError2(formError);
            return;
        }


        try {
            const user = {
                title: post.title,
                description: post.description
            }
            const token = localStorage.getItem('token');
            const {status} = await axios.put(`http://localhost:1338/api/posts/${id}`, user, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            setUpdated(!updated)
            alert("Votre post à été modifier avec succès !");
            if(status === 200) navigate("/homepage")
        } catch (error2) {
            console.error("Erreur", error2);
        }
    };

    useEffect(() => {
        fetchModifier()
        
    }, [updated])

    return(
        <div>
            <div>Page pour modifier</div>
             {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {modifier && (
                <div>
                    <div>
                    <p>{modifier.title}</p>
                    <p>{modifier.description}</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                    <input 
                    className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
                    rows="2"
                    name="title"
                    placeholder="Un titre ?"
                    value={post.title}
                    onChange={handleChange} />
                <textarea 
                    className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
                    rows="2"
                    name="description"
                    placeholder="Partagez vos pensées..."
                    value={post.description}
                    onChange={handleChange}
                ></textarea>
                <button type='submit'>Modifier</button>
                    </form>
                </div>
            )}
        </div>
    )
}