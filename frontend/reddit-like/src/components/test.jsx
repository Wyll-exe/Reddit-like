import '../index.css';
import { useEffect, useState } from 'react';

function AffichageCandidature() {
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchTest() {
        setLoading(true);
        try {
            const url = "http://localhost:1337/api/kiwis";

            // Ajout des en-têtes si nécessaire
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer bc9195e5cdb4310863538b8b3b05e27711af143ef1e25b9f4fb7dcc689027b9059996df2303924dff882956d55c74831d9c37e153e61684978c204e2602d4d6d988b92ac66f0d8f449c1c8903a178506c90dbb58d494fb576be0dbb1e23db83d5654f4446aaa7c127f8e4158352e3e28c3072748c4c08cddaa1285a36538dc02',
                },
            });

            if (!response.ok) {
                throw new Error("API introuvable ou erreur réseau");
            }

            const data = await response.json();
            console.log(data);
            setTest(data.title);
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
            <div>{test}</div>
        </div>
    );
}

export default AffichageCandidature;