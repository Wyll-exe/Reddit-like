import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

export default function ModifierPost () {
    const { id } = useParams();
    const [modifier, setModifier] = useState('')
    const [image, setImage] = useState([])
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

    const handleImage = event => {
        setImage(Array.from(event.target.files))
    }

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
            let fileIds = [];
            const token = localStorage.getItem('token');

            if (image.length > 0) {
                const formData = new FormData();
                image.forEach(file => formData.append('files', file))

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
                title: post.title,
                description: post.description,
                ...(fileIds.length > 0 && { media: fileIds })
            }
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
        <div>
            <div>Page pour modifier</div>
             {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {modifier && (
                <div>
                    <div>
                    <p>{modifier.title}</p>
                    <p>{modifier.description}</p>
                    {image && (
                        <img
                        src={`http://localhost:1337${image}`}
                        alt="Illustration"
                        className="w-full h-auto"
                        />
                    )}
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
                <input 
                    type="file" 
                    name="files"
                    className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none mt-3"
                    onChange={handleImage}
                />
                <button type='submit'>Modifier</button>
                    </form>
                </div>
            )}
        </div>
    )
}