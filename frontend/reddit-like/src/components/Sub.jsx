import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";

function Sub() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citation, setCitation] = useState('');
  const token = localStorage.getItem("token");


  // Choisir une citation
  const Mearde = {
    
    "Cyril": "Cyril : ''Commit to the bitbucket'' ",
    "Laurent": "Laurent : ''Pull request master'' ",
    "Arthur": "Arthur : ''Push it to the limit'' ",
    "Océane": "Océnae : ''Merge like a boss'' ",
    "William": "William : ''Fetch like a pro'' ",
  }
  

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:1338/api/subs?fields=Name,Description,createdAt&populate=Banner", {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
      const json = await response.json();
      setSubs(json.data);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      setTimeout(() => setLoading(false), 3574); // Timer
    }
  };

    // 
    const randomPhrase = Object.values(Mearde)[Math.floor(Math.random() * Object.values(Mearde).length)];
    setCitation(randomPhrase);

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous supprimer ce Thread ?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:1338/api/subs/${id}`, {
        method: "DELETE",
        headers: {
        'Authorization': `Bearer ${token}`,
      },
      });

      if (res.ok) {
        setSubs((prev) => prev.filter((item) => item.id !== id));
        alert("Supprimé à jamais !");
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur suppression :", error);
      alert("Une erreur est survenue.");
    }
  };

  if (loading) {
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
    <main className="w-full h-screen bg-gray-500 overflow-y-auto p-4">
      {subs.map((item) => (
        <div key={item.id} className="bg-white p-4 mb-4 rounded shadow">
          <h2 className="text-xl font-bold">{item.Name}</h2>
          <p>{item.Description}</p>
          <p>{new Date(item.createdAt).toLocaleString()}</p>

          {item.attributes?.Banner?.data?.attributes?.url && (
            <img
              src={`http://localhost:1338${item.attributes.Banner.data.attributes.url}`}
              alt="banner"
              className="w-72 h-auto mt-2"
            />
          )}

          <button
            onClick={() => handleDelete(item.id)}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Supprimer
          </button>
        </div>
      ))}
    </main>
  );
}

export default Sub;
