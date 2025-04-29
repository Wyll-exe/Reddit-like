import '../index.css';
import { useEffect, useState } from 'react';

function AffichageCandidature() {
    const [test, setTest] = useState([]);
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
                    'Authorization': 'Bearer 725274279f9de8bd0aa8c5019788fe5a5820154f3fa6938171763d3f55822136cdc15b01d66b480579fbf14c66032f37fe8390810db07fdf469085afa2d6eb02dc1a0fe960a3b9e1eac4b8dcaa569d85f13bc63e7f7b77881d741e94e201e01a6e15af7afbe52d5c1577098e7f207b1bbef765209ce7915edf53aa6467b699cf',
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

export default AffichageCandidature;