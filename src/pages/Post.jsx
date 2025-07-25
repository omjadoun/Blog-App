import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { verifySession } from "../store/authSlice"; // Import the verifySession action

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get auth state including loading status
    const { userData, status, loading: authLoading } = useSelector((state) => state.auth);
    const [isAuthor, setIsAuthor] = useState(false);

    // Verify session on component mount
    useEffect(() => {
        dispatch(verifySession());
    }, [dispatch]);

    // Update isAuthor whenever post or auth state changes
    useEffect(() => {
        if (!authLoading && post && userData) {
            setIsAuthor(post.userId === userData.$id);
        } else {
            setIsAuthor(false);
        }
    }, [post, userData, authLoading]);

    useEffect(() => {
        if (slug) {
            setLoading(true);
            setError(null);
            
            appwriteService.getPost(slug)
                .then((post) => {
                    if (post) {
                        setPost(post);
                    } else {
                        navigate("/");
                    }
                })
                .catch((err) => {
                    setError("Failed to load post");
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            appwriteService.deletePost(post.$id)
                .then((status) => {
                    if (status) {
                        appwriteService.deleteFile(post.featuredImage);
                        navigate("/");
                    }
                })
                .catch((err) => {
                    console.error("Failed to delete post:", err);
                    alert("Failed to delete post");
                });
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Container>
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading post...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Container>
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()} className="px-6 py-2">
                            Try Again
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="py-10 bg-gradient-to-b from-gray-800 via-gray-900 to-black min-h-screen">
            <Container>
                <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-xl shadow-md p-6 mb-8 
                    transition-all duration-300 ease-in-out 
                    hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1">
                    
                    {/* Author Controls - Only show when authenticated AND is author */}
                    {status && isAuthor && (
                        <div className="flex justify-end gap-4 mb-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                                    <span>✏️</span>
                                    <span>Edit Post</span>
                                </Button>
                            </Link>
                            <Button 
                                onClick={deletePost}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                            >
                                <span>🗑️</span>
                                <span>Delete</span>
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row items-start gap-6">
                        {/* Image Section */}
                        <div className="w-full lg:w-2/3">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-auto rounded-xl object-contain max-h-[400px]"
                            />
                        </div>

                        {/* Post Meta */}
                        <div className="w-full lg:w-1/3 space-y-4">
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium"></span> {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Post Title */}
                    <div className="mt-6">
                        <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
                    </div>

                    {/* Post Content */}
                    <div className="prose prose-lg max-w-none text-white mt-4">
                        {parse(post.content)}
                    </div>
                </div>
            </Container>
        </div>
    );
}