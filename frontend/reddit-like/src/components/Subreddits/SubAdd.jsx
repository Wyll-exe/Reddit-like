import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Sidebar/Sidebar';
import {jwtDecode} from 'jwt-decode';

function AddSubscriptionPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState(null);
  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).id : null;


  const checkNameExists = async (name) => {
    const response = await fetch(
      `http://localhost:1337/api/subs?filters[Name][$eqi]=${name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.data.length > 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Vous devez être connecté pour ajouter un Thread.');
      return;
    }

    if (!userId) {
      toast.error('ID introuvable.');
      return;
    }

    if (description.length < 3) {
      toast.error('La description doit contenir au moins 3 caractères.');
      return;
    }

    try {
      const nameExists = await checkNameExists(name);
      if (nameExists) {
        toast.error('Ce nom existe déjà. Veuillez en choisir un autre.');
        return;
      }

      let imageId = null;

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
          throw new Error(errorData?.error?.message || 'Échec de l\'upload de l\'image');
        }

        const uploadData = await uploadRes.json();
        imageId = uploadData?.[0]?.id;

        if (!imageId) {
          throw new Error('Échec de l\'upload');
        }
      }

      const res = await fetch('http://localhost:1337/api/subs?populate=author', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: name,
          Description: description,
          Banner: imageId,
          posts: [],
        }),
      });

      console.log(res);

      if (res.status == 200) {
        toast.success('Thread ajouté avec succès !');
        setTimeout(() => navigate('/subs'), 1500);
      } else {
        toast.error('Erreur lors de l\'ajout du Thread 1');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du Thread:', error);
      toast.error(error.message || 'Une erreur est survenue');
    }
  };

  if (loadingScreen) {
    return (
      <div className="w-full h-screen bg-gray-500 fixed top-0 left-0 transition-transform duration-700">
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
          <img src="./assets/images/threadly.png" alt="Logo" className="w-75 h-auto" />
          <p className="text-5xl italic font-serif text-gray-300">{citation}</p>
          <SyncLoader
            loading
            color="#D1D5DC"
            margin={5}
            size={30}
            speedMultiplier={1}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8f4e8] dark:bg-[#111827]">
      <div className="flex">
        <Sidebar />
        <div className="w-full md:ml-64 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Créer un Thread</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom du Thread *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#7bc297] dark:focus:ring-blue-500 focus:border-[#7bc297] dark:focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Entrez le nom du Thread"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (3 min) *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-4 py-2 h-32 resize-none border border-gray-300 rounded-md shadow-sm focus:ring-[#7bc297] dark:focus:ring-blue-500 focus:border-[#7bc297] dark:focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Décrivez votre Thread en quelques mots..."
                  />
                </div>

            <div>
              <label htmlFor="banner" className="block font-medium text-[#242424] mb-1">Bannière *</label>
              <input
                type="file"
                id="banner"
                onChange={(e) => setBanner(e.target.files[0])}
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:font-semibold
                  file:bg-[#86C7C3] file:text-white
                  hover:file:bg-[#A8DBD9]"
              />
            </div>

                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#7bc297] dark:bg-blue-600 hover:bg-[#5eaa7d] dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7bc297] dark:focus:ring-blue-500 transition-colors duration-200"
                >
                  Ajouter le Thread
                </button>

                <div className="flex justify-center mt-4">
                  <Link 
                    to="/subs" 
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    ← Retour aux Threads
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}

export default AddSubscriptionPage;