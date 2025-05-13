
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import RegisterPage from "./pages/RegisterPage";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import Sub from "./components/Subreddits/Sub.jsx";
import SubAdd from "./components//Subreddits/SubAdd.jsx";
import SubPage from "./pages/SubPage";

import "./style.css";
import ModifierPost from "./components/Posts/ModifierPost.jsx";
import DeletePost from "./components/Posts/DeletePost.jsx";
import PostDetails from "./components/Posts/PostDetails.jsx";
import NotFound from "./pages/404NotFound.jsx";
import Profile from "./components/User/Profile.jsx";

function App() {
  const [user, setUser] = useState(null);

  return (
    
    <Router>
      <div className="App bg-gray-500 h-[100%] w-[100%]">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path='*' element={<NotFound />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/subs" element={<Sub />} />
          <Route path="/subsPage/:documentId" element={<SubPage />} />
          <Route path="/add" element={<SubAdd />} />
          <Route path="/login" element={<AuthPage setUser={setUser} />} />
          <Route path="/homepage" element={<Homepage user={user} setUser={setUser} />} />
          <Route path="/homepage/:id" element={<ModifierPost />} />
          <Route path="/homepage/supp/:documentId" element={<DeletePost />} />
          <Route path="/post/:documentId" element={<PostDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App;