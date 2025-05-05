import React from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token JWT
    setUser(null); // Réinitialise l'utilisateur
    navigate("/login"); // Redirige vers la page de connexion
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Se déconnecter
    </button>
  );
}

export default Logout;