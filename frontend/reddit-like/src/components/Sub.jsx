import { useState, useEffect } from "react";
import "../style.css";

function Sub() {
    const [test, setTest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchTest() {
        setLoading(true);
        try {
            const url = "http://localhost:1337/api/subs";

            // Ajout des en-têtes si nécessaire
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 9a6f38f14b1c58f8d9016442e89170739778e98e0907fb825b9c392513c4758e46993dfde86454b746c036aef98f983f4a63504ff945e5ef156f61ba825295df46146e1678d7fb62d70c5b4d960904fa2637110678936106b5befcef6f0ff282d5ba648a7ba9196554b6c558eb5727f9b5482fddeef02f402e563a89498c7a5b',
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
            <div>
                {test.map((el) => (
                    <div key={el.id}>
                        <h2>{el.Name}</h2>
                        <p>{el.Description}</p>
                        <p>{new Date(el.createdAt).toLocaleString()}</p>
                        {el.Banner && el.Banner.formats && el.Banner.formats.large && (
                            <img
                                src={`http://localhost:1337${el.Banner.formats.large.url}`}
                                alt={el.Banner.name || "Image"}
                                style={{ width: "300px", height: "auto" }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
                
}

export default Sub;