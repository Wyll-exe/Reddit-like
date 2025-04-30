import '../index.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Logout from "../components/Auth/Logout"
import getCookie from "../components/Auth/Cookie";

function Homepage({ user, setUser }) {
    const [test, setTest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function fetchTest() {
        setLoading(true);
        try {
            const url = "http://localhost:1337/api/articles";

            const token = getCookie("jwtToken");

            // Ajout des en-têtes si nécessaire
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Ajout du token JWT dans l'en-tête Authorization
                },
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/login");
                    setUser(null);
                    throw new Error("Token invalide ou expiré. Veuillez vous reconnecter.")
                }
                throw new Error("API introuvable ou erreur réseau");
            }

            const data = await response.json();
            console.log(data.data)
            setTest(data.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTest();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="text-center">
                <p>Bienvenue, {user?.username}!</p>
                <Logout setUser={setUser} />
            </div>
            {loading && <p>Chargement...</p>}
            {error && <p>Erreur : {error.message}</p>}
            <div className="mt-4">{test.map((el) => (
                <div>{el.Fruit}</div>
            ))}    
            </div>
            <p className="mt-4">Ceci est censé représenter la Homepage lorsque l'utilisateur s'est authentifié</p>
        </div>
    );
}

export default Homepage;