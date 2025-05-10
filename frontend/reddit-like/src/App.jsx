
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import RegisterPage from "./pages/RegisterPage";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import Sub from "./components/Sub.jsx";
import SubAdd from "./components/SubAdd.jsx";
import "./style.css";
import ModifierPost from "./components/Posts/ModifierPost.jsx";
import DeletePost from "./components/Posts/DeletePost.jsx";
import PostDetails from "./components/Posts/PostDetails.jsx";

function App() {
  const [user, setUser] = useState(null); // État pour l'utilisateur connecté

  return (
    
    <Router>
      <div className="bg-gray-500 h-[100%] w-[100%]">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path='*' element={<h1> 404 error , not found </h1>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/subs" element={<Sub />} />
          <Route path="/add" element={<SubAdd />} />
          <Route path="/login" element={<AuthPage setUser={setUser} />} />
          <Route path="/homepage" element={<Homepage user={user} setUser={setUser} />} />
          <Route path="/homepage/:id" element={<ModifierPost />} />
          <Route path="/homepage/supp/:documentId" element={<DeletePost />} />
          <Route path="/post/:documentId" element={<PostDetails />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App;