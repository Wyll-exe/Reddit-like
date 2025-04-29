
import { useState } from "react";
import "../style.css";

function Sub() {
    const [test, setTest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchTest() {
        setLoading(true);
        try {
            const url = "http://localhost:1337/api/subs"; // SSDS

            // Ajout des en-têtes si nécessaire
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer e6ecd2f4d3df6adf2b4b044afb54bb90842324994b67017722e8f7ee9e8f2c09a47f98a45a95f5abc0ec75478e31b1bded59fb3ec0e41fb6eb55134e8d1b8c11303e5be0c4401f48b8b864d093e01fdd71e10611d649e0602a71d23b69a08f38d6dadde391a5f6a136176fd8e7ccdf17f84ede55d443c47f931b0dc09a4553e8',
                },
            });

            if (!response.ok) {
                throw new Error("API introuvable ou erreur réseau");
            }

            const data = await response.json();
            console.log(data.data);
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
        <div>
            {loading && <p>Chargement...</p>}
            {error && <p>Erreur : {error.message}</p>}
            <div>{test.map( (el) => {
                return el.title})}
                
                </div>
        </div>
    );
}

export default Sub;