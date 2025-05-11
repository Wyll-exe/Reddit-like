import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';


export default function ModifierPost ( user, setUser) {
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
            const {status} = await axios.put(`http://localhost:1337/api/posts/${id}`, user, {
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
        <div className="min-h-screen bg-[#e8f4e8]">
            <div className ="flex">
                <Sidebar />
                <div className="flex-1 ml-64 min-h-screen">
                    <div className="max-w-xl mx-auto mt-10 p-8 bg-[#778379] shadow-lg rounded-2xl">
        
        
        

        <div>
            <h2 className="text-3xl font-bold text-[#242424] mb-6 text-center">Modifications :</h2>
             
             {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}

            {modifier && (
                <div className="space-y-6">
                    <div className="bg-[#919fd4f5] p-4 rounded-lg border border-gray-200 text-center">
                        <p className="text-lg font-semibold text-[#4a4a4a]">
                            Titre  <span className="block font-normal">{modifier.title}</span>
                        </p>
                        <p className="text-lg font-semibold text-[#4a4a4a]">
                            Description  <span className="block font-normal">{modifier.description}</span>
                        </p>
                </div>
              


                    <form onSubmit={handleSubmit}>
                        <input 
                        className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none mb-3 mt-3"
                        rows="2"
                        name="title"
                        placeholder="Tous les livres ont besoin d'un titre ! "
                        value={post.title}
                        onChange={handleChange} />
                    <textarea 
                        className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
                        rows="2"
                        name="description"
                        placeholder="Décris moi ton aventure ?"
                        value={post.description}
                        onChange={handleChange} />

                    <button 
                    type='submit' 
                    className=" bg-[#86C7C3] hover:bg-[#A8DBD9] text-[#242424] font-semibold py-3 mt-4 px-4 rounded-lg transition-colors"
                    >
                        Modifier</button>
                    </form>
                </div>
            )}

                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}