import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Post from '../components/Posts/ShowPosts';
import FormPost from '../components/Posts/FormPosts';
import MobileNavigation from '../components/Mobile/MobileNav';
import {fetchPosts} from '../utils/Fetchapi';
import {createPost} from '../utils/Createapi'; 

function Homepage({ user, setUser }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followedPosts, setFollowedPosts] = useState({});

    const addPost = (newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    }

    useEffect(() => {
        async function loadPosts() {
            setLoading(true);
            try {
                const data = await fetchPosts();
                setPosts(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

    const toggleFollow = (postId) => {
        setFollowedPosts({
            ...followedPosts,
            [postId]: !followedPosts[postId]
        });
    };

    return (
        <div className="min-h-screen bg-[#e8f4e8]">
            <div className="flex">
                <Sidebar setUser={setUser} />
                <div className="w-full md:ml-64">
                    <div className="max-w-2xl mx-auto">
                        <FormPost addPost={addPost} />
                        {loading && <div>Chargement...</div>}
                        {error && <div>Erreur : {error.message}</div>}
                        {!loading && posts.map((post) => (
                            <Post 
                                key={post.id} 
                                post={post} 
                                toggleFollow={toggleFollow} 
                                followedPosts={followedPosts} 
                            />
                        ))}
                    </div>
                </div>
            </div>
            <MobileNavigation />
        </div>
    );
}

export default Homepage;