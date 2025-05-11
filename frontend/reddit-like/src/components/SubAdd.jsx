import React, { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';


function AddSubscriptionPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState(null);

  const checkNameExists = async (name) => {
    const response = await fetch(
      `http://localhost:1337/api/subs?filters[Name][$eq]=${name}`
    );
    const data = await response.json();
    return data.data.length > 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
  
    if (!token) {
      alert('Vous devez être connecté pour ajouter un Thread.');
      return;
    }
  
    if (!userId) {
      alert('ID introuvable.');
      return;
    }
  
    
    if (description.length < 3) {
      alert('La description doit contenir au moins 3 caractères.');
      return;
    }
  
    try {
      const nameExists = await checkNameExists(name);
      if (nameExists) {
        alert('Ce nom existe déjà. Veuillez en choisir un autre.');
        return;
      }
  
      let imageId = null;
  
      // Upload du fichier
      if (banner) {
        const imageFormData = new FormData();
        imageFormData.append('files', banner);
  
        const uploadRes = await fetch('http://localhost:1337/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageFormData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          console.error('Erreur d\'upload de l\'image:', errorData);
          throw new Error('Échec de l’upload de l’image');
        }

        const uploadData = await uploadRes.json();
        imageId = uploadData?.[0]?.id;

        if (!imageId) {
          throw new Error('Échec de l’upload');
        }
      }

      // Sub l'image en référence à l'ID de l'image uploadée
      const payload = {
        data: {
          Name: name,
          Description: description,
          Banner: imageId,
          author: parseInt(userId, 10),
        }
      };

      console.log('Payload:', payload);

      const res = await fetch('http://localhost:1337/api/subs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      const responseData = await res.json(); 
      console.log("Réponse de l'API :", responseData);
      
      if (!res.ok) {
        console.error("Erreur API :", responseData);
        throw new Error(responseData.error?.message || "Erreur lors de la création");
      }
      
      if (responseData.data) {
        alert('Thread ajouté avec succès !');
        navigate('/subs');
      } else {
        alert('Erreur lors de l\'ajout de Thread');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      alert('Une erreur lors de l’envoi');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Créer un Thread</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">Nom du Thread</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="banner" className="block font-medium mb-1">Image en bannière</label>
          <input
            type="file"
            id="banner"
            onChange={(e) => setBanner(e.target.files[0])}
            required
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-400 text-white py-2 px-4 rounded-lg hover:bg-green-300 transition-colors"
        >
          Ajouter le Thread
        </button>
        <Link to="/subs" className="flex items-center space-x-3">
            <span>Subs</span>
        </Link>
      </form>
    </div>
  );
}

export default AddSubscriptionPage;
