import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  // État pour suivre le mode actuel
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Fonction pour basculer le mode sombre
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  // Initialiser le mode au chargement du composant
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, []);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription");
      }
      const data = await response.json();
      navigate("/login"); // Redirige vers la page de connexion après l'inscription
    } catch (err) {
      setError(err.message);
    }
  };
  
  const validatePassword = (value) => {
    if (value.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
    } else {
      setError(null); // Réinitialise l'erreur si la validation est correcte
    }
    setPassword(value);
  };
  
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#e8f4e8] dark:bg-[#1A1C23]">
      {/* Logo en haut */}
      <div className="mb-6">
        <div
          className="flex justify-center h-12 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={toggleDarkMode}
          title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {isDarkMode ? (
            <img src="/assets/images/threadly-light.png" alt="Logo (mode sombre)" className="h-full" />
          ) : (
            <img src="/assets/images/threadly.png" alt="Logo" className="h-full" />
          )}
        </div>
      </div>
     
      {/* Formulaire */}
      <div className="w-full max-w-md">
        <form
          className="flex flex-col justify-center items-center gap-4 bg-white p-6 rounded-xl shadow-sm dark:bg-[#334155]"
          onSubmit={handleRegister}
        >
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="w-full p-3 bg-[#f5f5f5] border border-[#e5e5e5] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-[#f5f5f5] border border-[#e5e5e5] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-3 bg-[#f5f5f5] border border-[#e5e5e5] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full p-3 bg-gray-800 text-white dark:text-gray-700 rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-sm dark:bg-[#e8f4e8] dark:hover:bg-[#c7dec7]"
          >
            S'inscrire
          </button>
          <p className="text-sm text-gray-600 mt-2 dark:text-white">
            Déjà un compte ? <Link to="/login" className="text-gray-800 font-medium dark:text-[#e8f4e8] dark:hover:text-[#c7dec7]">Se connecter</Link>
          </p>
          {error && <p className="text-sm text-red-500 p-2 bg-red-50 rounded-lg w-full text-center dark:bg-red-900 dark:bg-opacity-20">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;