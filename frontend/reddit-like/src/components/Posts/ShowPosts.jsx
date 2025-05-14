import { useState, useEffect } from "react";
import { Link } from "react-router";
import { fetchSubAuthor } from "../../utils/Fetchapi";
import { jwtDecode } from "jwt-decode";

function Post({ post, toggleFollow, followedPosts }) {
  const [showLinks, setShowLinks] = useState(false);
  const [SubAuthor, setSubAuthor] = useState(null);
  const subDocumentId = post.sub?.documentId || null;
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;


  async function subAuthors() {
    try {
      const res = await fetchSubAuthor(subDocumentId);
      if (res) {
        const SubAuthor = res.data[0].author.id;
        setSubAuthor(SubAuthor);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des auteurs de sous-forums :", error);
    }
  }
  useEffect(() => {
    subAuthors();
  }, [subDocumentId]);


  return (
    <div className="bg-white m-3 rounded-xl shadow-sm overflow-hidden dark:bg-[#334155] dark:text-white">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={
                post.user?.profilePic ||
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
            <div className="text-xs text-gray-500">
              {post.sub?.Name || "Sans sous-forum"}
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() => toggleFollow(post.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium dark:bg-[#10B981]	 ${followedPosts[post.id]
              ? "bg-gray-200 text-gray-800"
              : "bg-[#e8f4e8] text-gray-700"
              }`}
          >
            {followedPosts[post.id] ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-4 dark:text-white break-all">{post.description}</p>
        {post.media && (
          <div className="rounded-lg overflow-hidden mb-4">
            <img
              src={"http://localhost:1337" + post.media[0].url}
              alt="Illustration"
              className="w-full h-auto"
            />
          </div>
        )}
        <div className="flex gap-[1rem] items-center h-6">
          <Link to={`/post/${post.documentId}`} className="text-gray-500">
            💬 <span>{post.commentCount || 0}</span>
          </Link>
          {(post.author.id === userId || SubAuthor === userId) && (
            <>
              <button
                onClick={() => setShowLinks(!showLinks)}
                className="text-gray-500 flex "
              >
                {showLinks ? "❌​" : "🔧​"}
              </button>
              {showLinks && (
                <div className="flex items-center gap-[1rem]">
                  <Link to={`/homepage/${post.documentId}`} className="flex justify-center items-center h-[35px] focus:outline-none bg-green-500 hover:bg-green-700 focus:ring-4 transition-colors text-white focus:ring-green-300 font-semibold rounded-lg px-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900 cursor-pointer">
                    Modifier
                  </Link>
                  <Link to={`/homepage/supp/${post.documentId}`} className="flex h-[35px] justify-center items-center focus:outline-none bg-red-500 hover:bg-red-700 focus:ring- transition-colors text-white focus:ring-red-300 font-semibold rounded-lg px-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer">
                    Supprimer
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
        <div className="text-xs mt-2 text-gray-500 dark:text-white">
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
