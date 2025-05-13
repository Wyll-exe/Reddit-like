import { useState } from "react";
import { Link } from "react-router-dom"; // Importation correcte depuis react-router-dom

function Post({ post, toggleFollow, followedPosts, userId }) {
  const [showLinks, setShowLinks] = useState(false);
  
  // Détermination de l'ID correct à utiliser
  const postId = post.id; // Utilisation de post.id de manière cohérente
  
  // Fonction pour vérifier si l'image existe
  const getImageUrl = () => {
    if (post.media && post.media[0] && post.media[0].url) {
      return `http://localhost:1337${post.media[0].url}`;
    }
    return null;
  };

  return (
    <div className="bg-white m-3 rounded-xl shadow-sm overflow-hidden dark:bg-[#334155] dark:text-white">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={
                post.author?.profilePic ||
                "https://randomuser.me/api/portraits/men/1.jpg"
              }
              alt="Profil"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-sm">
              @{post.author?.username || "Anonyme"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {post.sub?.Name || "Sans sous-forum"}
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() => toggleFollow(postId)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              followedPosts[postId]
                ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                : "bg-[#e8f4e8] text-gray-700 dark:bg-[#10B981] dark:text-white"
            }`}
          >
            {followedPosts[postId] ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-4 dark:text-white break-all">{post.description}</p>
        
        {getImageUrl() && (
          <div className="rounded-lg overflow-hidden mb-4">
            <img
              src={getImageUrl()}
              alt="Illustration"
              className="w-full h-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex gap-[1rem] items-center h-6">
          <Link to={`/post/${postId}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
            💬 <span>{post.commentCount || 0}</span>
          </Link>
          
          {post.author && post.author.id === userId && (
            <>
              <button
                onClick={() => setShowLinks(!showLinks)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              >
                {showLinks ? "❌​" : "🔧​"}
              </button>
              
              {showLinks && (
                <div className="flex items-center gap-[1rem]">
                  <Link 
                    to={`/homepage/${postId}`} 
                    className="flex justify-center items-center h-[35px] focus:outline-none bg-green-500 hover:bg-green-600 focus:ring-4 transition-colors text-white focus:ring-green-300 font-semibold rounded-lg px-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900 cursor-pointer"
                  >
                    Modifier
                  </Link>
                  <Link 
                    to={`/homepage/supp/${postId}`} 
                    className="flex h-[35px] justify-center items-center focus:outline-none bg-red-500 hover:bg-red-600 focus:ring-4 transition-colors text-white focus:ring-red-300 font-semibold rounded-lg px-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer"
                  >
                    Supprimer
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
          {new Date(post.createdAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;