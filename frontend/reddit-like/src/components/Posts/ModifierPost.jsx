import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';

export default function ModifierPost () {
    const { id } = useParams();
    const [modifier, setModifier] = useState('')
    const [image, setImage] = useState(null)
    const [newimage, setNewImage] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [updated, setUpdated] = useState(false)
    let navigate = useNavigate();
    const token = localStorage.getItem('token');


    async function fetchModifier() {
        setLoading(true)
        try {
            const url = `http://localhost:1337/api/posts/${id}`;

            const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json()
            setModifier(data.data)
            console.log(data.data)
            
            // Vérifier si media existe et n'est pas null
            if (data.data.media && data.data.media.length > 0) {
                setImage(data.data.media[0].url)
            } else {
                setImage(null)
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du post:", error)
            setError(error)
            return
        } finally {
            setLoading(false)
        }
    }

    const [error2, setError2] = useState({}); 


    const handleChange = (event) => {
        const { name, value } = event.target;
        setModifier(prevModifier => ({ ...prevModifier, [name]: value }));
    };

    const handleImage = event => {
        setNewImage(Array.from(event.target.files))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formError = {};
        if (!modifier.title) formError.title = 'Le titre est requis';
        if (!modifier.description) formError.description = 'La description est requise';

        if (Object.keys(formError).length > 0) {
            setError2(formError);
            return;
        }

        try {
            let fileIds = [];

            if (newimage.length > 0) {
                const formData = new FormData();
                newimage.forEach(file => formData.append('files', file))

                const img = await axios.post('http://localhost:1337/api/upload',
                    formData,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    }
                )
                const uploaded = img.data
                fileIds = uploaded.map(f => f.id)
            }

            const user = {
                title: modifier.title,
                description: modifier.description,
                ...(fileIds.length > 0 && { media: fileIds })
            }
            const {status} = await axios.put(`http://localhost:1337/api/posts/${id}`, user, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            setUpdated(!updated)
            alert("Votre post a été modifié avec succès !");
            if(status === 200) navigate("/homepage")
        } catch (error2) {
            console.error("Erreur lors de la modification:", error2);
        }
    };
    

    useEffect(() => {
        fetchModifier()
    }, [updated, id])

    return(
        <div className="min-h-screen bg-[#e8f4e8]">
            <div className="flex">
                <Sidebar />
                <div className="w-full md:ml-64 p-6">
                    <div className="max-w-xl mx-auto">
                        {loading && <p className="text-center text-gray-600 p-4 bg-white rounded-xl shadow-sm mb-4">Chargement...</p>}
                        {error && <p className="text-center text-red-500 p-4 bg-white rounded-xl shadow-sm mb-4">{error.message}</p>}
                        
                        {modifier && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                                    <div>
                                        <div className="font-medium">Modifier votre post</div>
                                    </div>
                                </div>
                                
                                <div className="p-4">
                                    <h3 className="text-gray-500 mb-3">Post actuel :</h3>
                                    
                                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                        <h2 className="text-lg font-semibold mb-2">{modifier.title}</h2>
                                        <p className="text-gray-700 mb-4">{modifier.description}</p>
                                        
                                        {image ? (
                                            <div className="rounded-lg overflow-hidden mb-2">
                                                <img
                                                    src={`http://localhost:1337${image}`}
                                                    alt="Illustration"
                                                    className="w-full h-auto"
                                                />
                                            </div>
                                        ) : (
                                            <div className="py-3 px-4 bg-gray-100 text-gray-500 text-center rounded-lg">
                                                Pas d'image uploadée
                                            </div>
                                        )}
                                    </div>
                                    
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="block text-gray-500 text-sm mb-1">Nouveau titre</label>
                                            <input 
                                                className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
                                                name="title"
                                                placeholder="Nouveau titre"
                                                value={modifier.title}
                                                onChange={handleChange} 
                                            />
                                            {error2.title && <p className="text-red-500 text-sm mt-1">{error2.title}</p>}
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label className="block text-gray-500 text-sm mb-1">Nouvelle description</label>
                                            <textarea 
                                                className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
                                                rows="3"
                                                name="description"
                                                placeholder="Nouvelle description"
                                                value={modifier.description}
                                                onChange={handleChange}
                                            ></textarea>
                                            {error2.description && <p className="text-red-500 text-sm mt-1">{error2.description}</p>}
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-gray-500 text-sm mb-1">Nouvelle image (optionnelle)</label>
                                            <div className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg">
                                                <input 
                                                    type="file" 
                                                    name="files"
                                                    className="w-full"
                                                    onChange={handleImage}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-3 mt-4">
                                            <button 
                                                type="button"
                                                onClick={() => navigate('/homepage')}
                                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
                                            >
                                                Annuler
                                            </button>
                                            <button 
                                                type="submit"
                                                className="flex-1 bg-green-700 hover:bg-green-900 text-white font-medium py-2 px-4 rounded-lg"
                                            >
                                                Enregistrer
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}