import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import Sidebar from "./Sidebar/Sidebar";
import { Link } from "react-router-dom";

function Sub( user, setUser) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citation, setCitation] = useState('');


  // Choisir une citation
  const Mearde = {
    
    "Cyril": "Cyril : ''Commit to the bitbucket'' ",
    "Laurent": "Laurent : ''Pull request M.A.S.T.E.R'' ",
    "Arthur": "Arthur : ''Push it to the limit'' ",
    "Océane": "Océnae : ''Merge like a boss'' ",
    "William": "William : ''Fetch like a pro'' ",
  }
  
  // Thread informations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:1337/api/subs?populate=*"
        );
        const json = await response.json();
        setSubs(json.data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setTimeout(() => setLoading(false), 574); // Timer
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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour supprimer un Thread.");
      }

      const res = await fetch(`http://localhost:1337/api/subs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
    <div className="min-h-screen bg-gray-500">
      <div className="flex">
        <Sidebar setUser={setUser} /> 
        <div className="w-full md:ml-64">
          <main className="w-full h-screen bg-gray-500 overflow-y-auto p-4">
            <Link to="/add" className="flex items-center space-x-3">
            <span>Add sub</span>
            </Link>
            {subs.map((item) => (
              <div key={item.id} className="bg-white p-4 mb-4 rounded-[120px] shadow">
                <h2 className="text-xl font-bold">{item.Name}</h2>
                <p>{item.Description}</p>
                <p>{new Date(item.createdAt).toLocaleString()}</p>

                {item.Banner?.url && (
                  <img
                    src={`http://localhost:1337${item.Banner.url}`}
                    alt="banner"
                    className="w-300 h-20 mt-2"
                  />
                )}

                {item.author && (
                  <p className="text-sm text-gray-500">Créé par : {item.author.username}</p>
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
        </div>
      </div>
    </div>
  );
}


export default Sub;
