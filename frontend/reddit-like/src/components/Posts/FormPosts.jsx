import { useState } from 'react';
import axios from 'axios';

export default function FormPost({ addPost }) {
    const [Form, setForm] = useState({
        title: "",
        description: ""
    })
    const[error, setError] = useState({})

    const handleChangePost = async (event) => {
        const { name, value } = event.target;
        setForm(prevForm => ({ ...prevForm, [name]: value}))
    }


    const handlePostSubmit = async (event) => {
        event.preventDefault();

        let formError = {};
        if (!Form.title) formError.title = "Champs requis"
        if (!Form.description) formError.description = "Champs requis"
    
    
        const user = {
                title: Form.title,
                description: Form.description
        };

                try {
            const token = localStorage.getItem('token');
            const { data, status } = await axios.post(
                'http://localhost:1338/api/posts',
                user,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            if (status === 200) {
                addPost(data.data);
                setForm({
                    title: "",
                    description: ""
                });
            }
        } catch (error) {
            console.error("Erreur lors de la requête :", error.response?.data || error.message);
        }
    }


    return (
        <div className="p-4 bg-white m-3 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="text-gray-500">Qu'avez-vous en tête ?</div>
            </div>
            <form onSubmit={handlePostSubmit}>
                <input 
                    className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
                    rows="2"
                    name="title"
                    placeholder="Un titre ?"
                    value={Form.title}
                    onChange={handleChangePost} />
                <textarea 
                    className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none"
                    rows="2"
                    name="description"
                    placeholder="Partagez vos pensées..."
                    value={Form.description}
                    onChange={handleChangePost}
                ></textarea>
                <input 
                    type="file" 
                    className="w-full p-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus:outline-none mt-3"
                    onChange={(e) => setPostImage(e.target.files[0])}
                />
                <div className="flex justify-between mt-3">
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium"
                    >
                        Publier
                    </button>
                </div>
            </form>
        </div>
    );
}